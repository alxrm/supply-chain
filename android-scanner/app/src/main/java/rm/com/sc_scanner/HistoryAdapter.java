package rm.com.sc_scanner;

import android.view.LayoutInflater;
import android.view.ViewGroup;

public final class HistoryAdapter extends BaseAdapter<HistoryEntry, HistoryEntryHolder> {

  @Override public HistoryEntryHolder onCreateViewHolder(ViewGroup parent, int viewType) {
    return new HistoryEntryHolder(
        LayoutInflater.from(parent.getContext()).inflate(R.layout.item_transaction, parent, false));
  }

  @Override public void onBindViewHolder(HistoryEntryHolder holder, int position) {
    super.onBindViewHolder(holder, position);
  }
}