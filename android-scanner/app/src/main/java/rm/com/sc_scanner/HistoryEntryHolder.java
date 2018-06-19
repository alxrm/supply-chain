package rm.com.sc_scanner;

import android.support.annotation.NonNull;
import android.view.View;
import android.widget.TextView;
import butterknife.BindView;

/**
 * Created by alex
 */

public final class HistoryEntryHolder extends BaseHolder<HistoryEntry> {
  @BindView(R.id.tx_name) TextView name;
  @BindView(R.id.tx_hash) TextView hash;
  @BindView(R.id.tx_status) TextView status;

  public HistoryEntryHolder(View itemView) {
    super(itemView);
  }

  @Override public void bind(@NonNull HistoryEntry model) {
    name.setText(model.name);
    hash.setText(model.txHash);
    //signature.setText(model.signature);
    status.setText(model.executionStatus ? "Успешно" : "Отменена");
    status.setTextColor(model.executionStatus ? 0xFF008800 : 0xFF880000);
  }
}
