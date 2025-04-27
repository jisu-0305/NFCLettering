package com.example.lettering.util;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import net.coobird.thumbnailator.Thumbnails;
import org.imgscalr.Scalr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

public class ImageProcessingUtils {

    public static byte[] compressImage(InputStream originalInputStream, String contentType) throws IOException {
        String lowerContentType = contentType.toLowerCase();

        if (lowerContentType.contains("gif")) { //gif는 압축 불가능
            return originalInputStream.readAllBytes();
        }

        // 🔁 InputStream 복제 (EXIF + 이미지 읽기용)
        ByteArrayOutputStream baosForExif = new ByteArrayOutputStream();
        originalInputStream.transferTo(baosForExif);
        byte[] imageBytes = baosForExif.toByteArray();

        InputStream exifStream = new ByteArrayInputStream(imageBytes);
        InputStream imageStream = new ByteArrayInputStream(imageBytes);

        // 🔍 원본 이미지 + 회전 보정
        BufferedImage originalImage = ImageIO.read(imageStream);
        BufferedImage rotatedImage = rotateImageIfNeeded(originalImage, exifStream);

        BufferedImage resizedImage = Thumbnails.of(rotatedImage)
                .scale(0.4)
                .asBufferedImage();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        String formatName;
        if (lowerContentType.contains("heic") || lowerContentType.contains("heif")) {
            formatName = "jpg"; // HEIC/HEIF는 JPEG로 변환
        } else if (lowerContentType.contains("webp")) {
            formatName = "webp";
        } else if (lowerContentType.contains("png")) {
            formatName = "png";
        } else {
            formatName = "jpg";
        }

        ImageIO.write(resizedImage, formatName, baos);
        return baos.toByteArray();
    }

    public static BufferedImage rotateImageIfNeeded(BufferedImage image, InputStream exifInputStream) {
        try {
            File tempFile = File.createTempFile("rotate_", ".tmp");
            try (OutputStream os = new FileOutputStream(tempFile)) {
                exifInputStream.transferTo(os);
            }

            Metadata metadata = ImageMetadataReader.readMetadata(tempFile);
            tempFile.delete();

            Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            int orientation = 1;
            if (directory != null && directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION)) {
                orientation = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            }

            return switch (orientation) {
                case 3 -> Scalr.rotate(image, Scalr.Rotation.CW_180);
                case 6 -> Scalr.rotate(image, Scalr.Rotation.CW_90);
                case 8 -> Scalr.rotate(image, Scalr.Rotation.CW_270);
                default -> image;
            };
        } catch (Exception e) {
            return image;
        }
    }
}
