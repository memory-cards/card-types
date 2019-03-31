module.exports = (prefix = 'xxx') =>
  Buffer.from(`${prefix}-${Date.now()}-${Math.random()}`)
    .toString('base64')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 30);
