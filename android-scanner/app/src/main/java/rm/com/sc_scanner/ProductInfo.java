package rm.com.sc_scanner;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import java.util.ArrayList;
import java.util.List;

public final class ProductInfo {

  @SerializedName("data") @Expose public ProductData productData;
  @SerializedName("history") @Expose public List<HistoryEntry> history =
      new ArrayList<HistoryEntry>();

  public ProductInfo() {
  }

  public ProductInfo(ProductData productData, List<HistoryEntry> history) {
    super();
    this.productData = productData;
    this.history = history;
  }
}
