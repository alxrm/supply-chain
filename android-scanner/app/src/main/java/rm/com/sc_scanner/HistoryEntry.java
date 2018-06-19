package rm.com.sc_scanner;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public final class HistoryEntry {

  @SerializedName("body") @Expose public Body body;
  @SerializedName("message_id") @Expose public int messageId;
  @SerializedName("network_id") @Expose public int networkId;
  @SerializedName("protocol_version") @Expose public int protocolVersion;
  @SerializedName("service_id") @Expose public int serviceId;
  @SerializedName("signature") @Expose public String signature;
  @SerializedName("execution_status") @Expose public boolean executionStatus;
  @SerializedName("tx_hash") @Expose public String txHash;
  @SerializedName("name") @Expose public String name;

  /**
   * No args constructor for use in serialization
   */
  public HistoryEntry() {
  }
  public HistoryEntry(Body body, int messageId, int networkId, int protocolVersion, int serviceId,
      String signature, boolean executionStatus, String txHash, String name) {
    super();
    this.body = body;
    this.messageId = messageId;
    this.networkId = networkId;
    this.protocolVersion = protocolVersion;
    this.serviceId = serviceId;
    this.signature = signature;
    this.executionStatus = executionStatus;
    this.txHash = txHash;
    this.name = name;
  }
}
