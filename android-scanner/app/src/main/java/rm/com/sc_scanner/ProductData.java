package rm.com.sc_scanner;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public final class ProductData {

  @SerializedName("group_id") @Expose public String groupId;
  @SerializedName("history_hash") @Expose public String historyHash;
  @SerializedName("history_len") @Expose public String historyLen;
  @SerializedName("name") @Expose public String name;
  @SerializedName("owner_key") @Expose public String ownerKey;
  @SerializedName("transferring") @Expose public boolean transferring;
  @SerializedName("uid") @Expose public String uid;

  public ProductData() {
  }

  public ProductData(String groupId, String historyHash, String historyLen, String name, String ownerKey,
      boolean transferring, String uid) {
    this.groupId = groupId;
    this.historyHash = historyHash;
    this.historyLen = historyLen;
    this.name = name;
    this.ownerKey = ownerKey;
    this.transferring = transferring;
    this.uid = uid;
  }
}
