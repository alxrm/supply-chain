package rm.com.sc_scanner;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public final class Body {

  @SerializedName("name") @Expose public String name;
  @SerializedName("owner") @Expose public String owner;
  @SerializedName("product_uid") @Expose public String productUid;
  @SerializedName("seed") @Expose public String seed;
  @SerializedName("group") @Expose public String group;

  public Body() {
  }

  public Body(String name, String owner, String productUid, String seed, String group) {
    super();
    this.name = name;
    this.owner = owner;
    this.productUid = productUid;
    this.seed = seed;
    this.group = group;
  }
}
