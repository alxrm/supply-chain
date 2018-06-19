package rm.com.sc_scanner;

import android.support.annotation.NonNull;

public interface OnDataReceivedListener {
  void onDataReceived(@NonNull ProductInfo info);
}