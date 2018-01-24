use exonum::api::Api;

pub trait ApiHolder<A: Api> {
    fn api() -> A {
        unimplemented!();
    }
}

pub trait Controller<P, R, E> {
    fn process(&self, params: &P) -> Result<R, E>;
}
