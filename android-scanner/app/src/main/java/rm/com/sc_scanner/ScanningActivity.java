package rm.com.sc_scanner;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
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
  private static final String START_TEXT =
      "Наведите на QR код, чтобы подключить авторизовать сканер в системе";
  private static final String WORK_TEXT = "Отсканируйте QR код, чтобы добавлять товар на склад";

  private CaptureManager capture;
  private DecoratedBarcodeView barcodeScannerView;

  private String[] keys = new String[2];

  private BarcodeCallback callback = new BarcodeCallback() {
    @Override public void barcodeResult(BarcodeResult result) {
      final Intent returnIntent = new Intent();
      final String scannedText = result.getText();

      Log.e("DBG", "Scanned: " + scannedText);

      if (scannedText != null) {
        final String[] keys = scannedText.split("_");

        returnIntent.putExtra("pubKey", keys[0]);
        returnIntent.putExtra("secretKey", keys[1]);
      }

      //setResult(RESULT_OK, returnIntent);
      //finish();
    }

    @Override public void possibleResultPoints(List<ResultPoint> resultPoints) {

    }
  };

  @Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    final boolean isAuthorized = keys[0] != null && keys[1] != null;

    setContentView(com.google.zxing.client.android.R.layout.zxing_capture);
    barcodeScannerView = findViewById(com.google.zxing.client.android.R.id.zxing_barcode_scanner);
    barcodeScannerView.setStatusText(isAuthorized ? WORK_TEXT : START_TEXT);

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
