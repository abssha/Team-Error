export const healthController = {
  check(req, res) {
    res.json({
      status: 'ok',
      service: 'Phantom Load API',
      timestamp: new Date().toISOString()
    });
  }
};