package com.example.lettering.domain.keyring.service;

import com.example.lettering.controller.request.keyring.KeyringCustomizeRequest;
import com.example.lettering.controller.request.keyring.KeyringDesignRequest;
import com.example.lettering.controller.request.user.OrderRequest;
import com.example.lettering.controller.response.keyring.*;
import com.example.lettering.domain.keyring.entity.Order;
import com.example.lettering.domain.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface KeyringService {
    KeyringDesignListResponse getAllKeyringDesigns();
    KeyringDesignResponse getKeyringDesignById(Long designId);
    Order processOrderAndReturnOrder(User user, OrderRequest request);
    void toggleFavorite(Long keyringId, Long userId);
    int registerKeyrings(List<String> tagCodes);
    List<KeyringManageResponse> getManageList(Long userId);
    void updateNfcName(Long keyringId, Long userId, String newName);
    void removeKeyringFromUser(Long keyringId, Long userId);
    KeyringManageResponse getKeyringById(Long keyringId, Long userId);
    void saveOrder(Order order);
    Long generateTempOrderNumber();
    KeyringDesignResponse createKeyringDesign(KeyringDesignRequest request, MultipartFile image) throws IOException;
    void deleteKeyring(Long keyringId);
    List<KeyringFilterResponse> getKeyringsByOwner(Long userId);
    void customizeKeyrings(Long userId, List<KeyringCustomizeRequest.KeyringInfo> keyrings);
    Long validateOrRegisterDevice(Long keyringId, String deviceId);
    String getCustomMessage(Long keyringId);
    boolean isValidKeyring(Long keyringId);
    KeyringDesignWithStockResponse getKeyringDesignWithStock(Long designId);
}
