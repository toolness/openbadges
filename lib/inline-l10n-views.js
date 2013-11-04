var path = require('path');
var fs = require('fs');
var InlineL10n = require('./inline-l10n');

function getViewFilename(rootPath, urlPath) {
  var filename = urlPath.match(/^\/([A-Za-z0-9_\-]+)\.html$/);
  if (!filename) return null;
  filename = path.join(rootPath, filename[1] + '.html');
  if (!fs.existsSync(filename)) return null;
  return filename;
}

module.exports = function InlineL10nViews(rootPath) {
  return function(req, res, next) {
    var filename = getViewFilename(rootPath, req.path);
    if (!filename) return res.send(404);
    var contents = fs.readFileSync(filename, 'utf-8');
    var l10n = {};
    Object.keys(InlineL10n.parse(contents)).forEach(function(key) {
      l10n[key] = req.gettext(key);
    });
    contents = InlineL10n(contents, l10n);
    return res.type('text/html; charset=utf-8').send(contents);
  }
};
