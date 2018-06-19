package rm.com.sc_scanner;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.TextView;
import butterknife.BindView;
import butterknife.ButterKnife;
import com.google.gson.Gson;

public final class InfoActivity extends AppCompatActivity implements OnDataReceivedListener {
  private static String data =
      "{\"data\":{\"group_id\":\"92d97a700ff54d6686a2689f0e5bc4ed\",\"history_hash\":\"585cd7a51acb858b1bdc048842901016024e40c48a5de683a4a571d43d9c5f47\",\"history_len\":\"2\",\"name\":\"Вода Aqua Minerale 1л Контейнер 200 шт\",\"owner_key\":\"89687157fe492f3631809c8620435ced8c1c468bcb4ae624367c3b9a49c26b63\",\"transferring\":false,\"uid\":\"06592853f5204934bf7ca559a476a304\"},\"history\":[{\"body\":{\"name\":\"Вода Aqua Minerale 1л Контейнер 200 шт\",\"owner\":\"89687157fe492f3631809c8620435ced8c1c468bcb4ae624367c3b9a49c26b63\",\"product_uid\":\"06592853f5204934bf7ca559a476a304\",\"seed\":\"9421432460648809081\"},\"message_id\":129,\"network_id\":1,\"protocol_version\":1,\"service_id\":1337,\"signature\":\"849c6c8ca9942c34cf5c64c41d6a3056006c35ac7adf23e072ff6b33b49dab8b58f33f0c77f0a3cfdf190b0cb05dd7f3e8bbcd02e32f8c33e1e00506b1fc5d03\",\"execution_status\":true,\"tx_hash\":\"09e2c92232eb6b5106c1ef2944eaa55bd939cb19b17f120f53195cc2c6b7da16\",\"name\":\"Товар добавлен в систему\"},{\"body\":{\"group\":\"92d97a700ff54d6686a2689f0e5bc4ed\",\"owner\":\"89687157fe492f3631809c8620435ced8c1c468bcb4ae624367c3b9a49c26b63\",\"product_uid\":\"06592853f5204934bf7ca559a476a304\",\"seed\":\"7246147765425539133\"},\"message_id\":130,\"network_id\":1,\"protocol_version\":1,\"service_id\":1337,\"signature\":\"ffd5585dd8bff71a53488ba37ff644ceb75c11bd96d018be8d244acf4d974ed179c607f327e586296a686c42af6aef4e216ac3a4be702d66fe0a733a050b9309\",\"execution_status\":true,\"tx_hash\":\"6399bcc776a2c592ba5730581897bd9e046028533ed9b0a2376c653bf1b26231\",\"name\":\"Товар добавлен в партию\"}]}";

  @BindView(R.id.history) RecyclerView historyView;
  @BindView(R.id.web) WebView web;
  @BindView(R.id.name) TextView name;

  private HistoryAdapter historyAdapter = new HistoryAdapter();

  @Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_info);
    ButterKnife.bind(this);
    final String product = getIntent().getStringExtra("product");
    final JSInterface bridge = new JSInterface(web, this);

    web.addJavascriptInterface(bridge, "JSInterface");
    web.getSettings().setJavaScriptEnabled(true);

    //web.setWebViewClient(new WebViewClient() {
    //  @Override public void onPageStarted(WebView view, String url, Bitmap favicon) {
    //    super.onPageStarted(view, url, favicon);
    //    web.loadUrl("javascript:fetchProduct(\"" + product + "\")");
    //  }
    //});

    web.loadUrl("file:///android_asset/index.html");

    historyView.setLayoutManager(new LinearLayoutManager(this));
    historyView.setAdapter(historyAdapter);

    final ProductInfo productInfo = new Gson().fromJson(data, ProductInfo.class);

    onDataReceived(productInfo);
  }

  @Override public void onDataReceived(@NonNull ProductInfo info) {
    name.setText(
        "Название: " + info.productData.name + "\n" + "Идентификатор:" + info.productData.uid);
    historyAdapter.updateData(info.history);
  }

  public static final class JSInterface {
    private final WebView mAppView;
    private final OnDataReceivedListener listener;

    public JSInterface(@NonNull WebView appView, @NonNull OnDataReceivedListener listener) {
      this.mAppView = appView;
      this.listener = listener;
    }

    @JavascriptInterface public void onResult(@NonNull String result) {
    }
  }
}
