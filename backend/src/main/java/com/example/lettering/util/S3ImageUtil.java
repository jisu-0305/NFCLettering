package com.example.lettering.util;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.example.lettering.config.S3Config;
import com.example.lettering.exception.ExceptionCode;
import com.example.lettering.exception.type.ExternalApiException;
import com.example.lettering.util.enums.ImageQuality;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RequiredArgsConstructor
@Component
public class S3ImageUtil {

    private final S3Config s3Config;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadImage(MultipartFile file, String folderName) throws IOException {
        // 파일 이름에서 확장자 추출
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new ExternalApiException(ExceptionCode.S3_UPLOAD_ERROR);
        }
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

        String s3Key = folderName + "/" + UUID.randomUUID() + extension;

        try (InputStream inputStream = file.getInputStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            s3Config.amazonS3Client().putObject(
                    new PutObjectRequest(bucket, s3Key, inputStream, metadata)
            );
        }

        return s3Config.amazonS3Client().getUrl(bucket, s3Key).toString();
    }

    // 고화질 이미지 업로드 (원본 그대로)
    public String uploadHighQualityImage(MultipartFile file, String folderName) throws IOException {
        return uploadImageWithImageQuality(file, folderName+"/high", ImageQuality.HIGH);
    }

    // 저화질 이미지 업로드 (압축/리사이징 적용)
    public String uploadLowQualityImage(MultipartFile file, String folderName) throws IOException {
        return uploadImageWithImageQuality(file, folderName+"/low", ImageQuality.LOW);
    }

    // 고화질 이미지 비동기 처리
    @Async
    public CompletableFuture<String> uploadHighQualityImageAsync(MultipartFile file, String folderName) throws IOException {
        return CompletableFuture.completedFuture(uploadHighQualityImage(file, folderName));
    }

    // 저화질 이미지 비동기 처리
    @Async
    public CompletableFuture<String> uploadLowQualityImageAsync(MultipartFile file, String folderName) throws IOException {
        return CompletableFuture.completedFuture(uploadLowQualityImage(file, folderName));
    }

    private String uploadImageWithImageQuality(MultipartFile file, String folderName, ImageQuality imageQuality) throws IOException {
        // 파일 이름에서 확장자 추출
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new ExternalApiException(ExceptionCode.S3_UPLOAD_ERROR);
        }
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

        // 만약 저화질이고, HEIC/HEIF 파일이라면 JPEG로 변환 (확장자와 contentType 변경)
        String updatedContentType = file.getContentType();
        if (imageQuality == ImageQuality.LOW &&
                (extension.equalsIgnoreCase(".heic") || extension.equalsIgnoreCase(".heif"))) {
            extension = ".jpg";
            updatedContentType = "image/jpeg";
        }

        if (!isAllowedExtension(extension)) {
            throw new ExternalApiException(ExceptionCode.INVALID_IMAGE_FORMAT);
        }

        // UUID 생성; 폴더명은 이미 caller에서 "high" 또는 "low"가 붙은 상태
        String uuid = UUID.randomUUID().toString();
        String s3Key = folderName + "/" + uuid + extension;

        InputStream inputStream;
        long contentLength;
        if (imageQuality == ImageQuality.LOW) {
            byte[] compressedBytes = ImageProcessingUtils.compressImage(file.getInputStream(), file.getContentType());
            inputStream = new ByteArrayInputStream(compressedBytes);
            contentLength = compressedBytes.length;
        } else {
            inputStream = file.getInputStream();
            contentLength = file.getSize();
        }

        try (InputStream is = inputStream) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(contentLength);
            metadata.setContentType(updatedContentType);

            s3Config.amazonS3Client().putObject(new PutObjectRequest(bucket, s3Key, is, metadata));
        }

        return s3Config.amazonS3Client().getUrl(bucket, s3Key).toString();
    }

    public byte[] downloadImageBytes(String imageUrl) {
        try {
            String key = extracts3ImageKeyFromUrl(imageUrl);
            S3Object s3Object = s3Config.amazonS3Client().getObject(bucket, key);
            try (S3ObjectInputStream inputStream = s3Object.getObjectContent()) {
                return inputStream.readAllBytes();
            }
        } catch (Exception e) {
            throw new ExternalApiException(ExceptionCode.S3_DOWNLOAD_ERROR);
        }
    }

    // 파일 확장자 검증 메서드 (예: .png, .jpg, .jpeg, .heic, .heif 허용)
    private boolean isAllowedExtension(String extension) {
        String ext = extension.toLowerCase();
        return ext.equals(".png") || ext.equals(".jpg") || ext.equals(".jpeg")
                || ext.equals(".heic") || ext.equals(".heif")
                || ext.equals(".gif") || ext.equals(".webp");
    }

    /**
     * S3에서 이미지 삭제
     * @param s3Url 실제 이미지의 URL (예: https://bucketname.s3.region.amazonaws.com/foldername/uuid.PNG)
     * S3에서 이미지를 삭제하려면 해당 파일의 "Key"가 필요합니다. 따라서 추출하는 메서드 필요: extracts3ImageKeyFromUrl
     */
    public void deleteImageByUrl(String imageUrl) {
        try {
            String s3ImageKey = extracts3ImageKeyFromUrl(imageUrl);
            s3Config.amazonS3Client().deleteObject(bucket, s3ImageKey);
        } catch (Exception e) {
            throw new ExternalApiException(ExceptionCode.S3_DELETE_ERROR);
        }
    }

    private String extracts3ImageKeyFromUrl(String imageUrl) {
        try {
            return imageUrl.substring(imageUrl.indexOf(".com/") + 5);
        } catch (Exception e) {
            throw new ExternalApiException(ExceptionCode.S3_URL_ERROR);
        }
    }
}
