#[derive(Clone)]
struct ApiHandler<T: TransactionSend + Clone> {
    pub api: SupplyChainApi<T>,
}

impl<T> ApiHandler<T> where T: 'static + TransactionSend + Clone {
    fn new(api: SupplyChainApi<T>) -> Self {
        ApiHandler {
            api
        }
    }

    fn handle_owner(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let owner_key = path.last().unwrap();
        let public_key = PublicKey::from_hex(owner_key).map_err(ApiError::FromHex)?;
        let api = &self.api;
        let origin = match api.owner(&public_key) {
            Ok(own) => api.ok_response(&to_value(own).unwrap()),
            Err(e) => {
                error!("Error in handle_owner: {}", e);
                api.not_found_response(&to_value("Owner not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    fn handle_item(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let item_uid = path.last().unwrap().to_string();
        let api = &self.api;
        let origin = match api.item(&item_uid) {
            Ok(item) => api.ok_response(&to_value(item).unwrap()),
            Err(e) => {
                error!("Error in handle_item: {}", e);
                api.not_found_response(&to_value("Item not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    fn handle_group(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let group_id = path.last().unwrap().to_string();
        let api = &self.api;
        let origin = match api.group(&group_id) {
            Ok(items) => api.ok_response(&to_value(items).unwrap()),
            Err(_) => {
                api.not_found_response(&to_value("Group not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    fn handle_items_by_owner(&self, req: &mut Request) -> IronResult<Response> {
        let owner_key = req.extensions.get::<Router>().unwrap().find("pubKey");
        let api = &self.api;
        let public_key = match owner_key {
            Some(key) => PublicKey::from_hex(key).map_err(ApiError::FromHex)?,
            None => {
                return Err(ApiError::IncorrectRequest(
                    "Incorrect request: no public key provided".into()
                ))?;
            }
        };

        let origin = match api.items_by_owner(&public_key) {
            Ok(items) => api.ok_response(&to_value(items).unwrap()),
            Err(e) => {
                error!("Error in handle_items_by_owner: {}", e);
                api.not_found_response(&to_value("Owner not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    fn handle_post_transaction(&self, req: &mut Request) -> IronResult<Response> {
        let api = &self.api;
        let origin = match req.get::<bodyparser::Struct<BaseTransaction>>() {
            Ok(Some(transaction)) => {
                let tx_hash = api.post_transaction(transaction)?;
                let json = TxResponse { tx_hash };
                api.ok_response(&to_value(&json).unwrap())
            }
            Ok(None) => Err(ApiError::IncorrectRequest("Empty request body".into()))?,
            Err(e) => Err(ApiError::IncorrectRequest(Box::new(e)))?,
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }
}