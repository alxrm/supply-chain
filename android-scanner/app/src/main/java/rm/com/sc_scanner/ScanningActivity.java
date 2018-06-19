package rm.com.sc_scanner;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import com.google.zxing.ResultPoint;
import com.journeyapps.barcodescanner.BarcodeCallback;
import com.journeyapps.barcodescanner.BarcodeResult;
import com.journeyapps.barcodescanner.CaptureManager;
import com.journeyapps.barcodescanner.DecoratedBarcodeView;
import java.util.List;

/**
 * Created by alex
 */
public final class ScanningActivity extends Activity {
  private CaptureManager capture;
  private DecoratedBarcodeView barcodeScannerView;

  private BarcodeCallback callback = new BarcodeCallback() {
    @Override public void barcodeResult(BarcodeResult result) {
      final String scannedText = result.getText();

      Log.e("DBG", "Scanned: " + scannedText);

      if (TextUtils.isEmpty(scannedText)) {
        return;
      }

      final String[] keys = scannedText.split("-");

      if (keys[0].equals("product")) {
        startActivity(new Intent(ScanningActivity.this, InfoActivity.class) //
            .putExtra("product", keys[1]));
      }
    }

    @Override public void possibleResultPoints(List<ResultPoint> resultPoints) {

    }
  };

  @Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(com.google.zxing.client.android.R.layout.zxing_capture);
    barcodeScannerView = findViewById(com.google.zxing.client.android.R.id.zxing_barcode_scanner);
    barcodeScannerView.setStatusText("Отсканируйте код, чтобы получить информацию о товаре");

    capture = new CaptureManager(this, barcodeScannerView);
    barcodeScannerView.decodeSingle(callback);
  }

  @Override protected void onResume() {
    super.onResume();
    capture.onResume();
  }

  @Override protected void onPause() {
    super.onPause();
    capture.onPause();
  }

  @Override protected void onDestroy() {
    super.onDestroy();
    capture.onDestroy();
  }

  @Override protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    capture.onSaveInstanceState(outState);
  }
}
