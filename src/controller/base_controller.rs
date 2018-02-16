pub trait BaseController<P, R, E>: Sync + Send {
    fn process(&self, params: Box<P>) -> Result<R, E>;
}
