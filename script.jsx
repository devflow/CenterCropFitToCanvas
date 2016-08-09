if (app.documents.length > 0) {
    app.activeDocument.suspendHistory('CenterCropFitLayerToCanvas', 'CenterCropFitLayerToCanvas()');
}

function CenterCropFitLayerToCanvas() {
    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    if (layer.isBackgroundLayer || layer.allLocked || layer.pixelsLocked ||
        layer.positionLocked || layer.transparentPixelsLocked) return;

    if (layer.kind != LayerKind.NORMAL && layer.kind != LayerKind.SMARTOBJECT) return;

    var defaultRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;

    var layerWidth = doc.width.as('px');
    var layerHeight = doc.height.as('px');
    var bounds = app.activeDocument.activeLayer.bounds;
    var width = bounds[2].as('px') - bounds[0].as('px');
    var height = bounds[3].as('px') - bounds[1].as('px');

    var source_asepct = width / height;
    var deisired_aspect = layerWidth / layerHeight;
    var newHeight = 0;
    var newWidth = 0;

    if (source_asepct > deisired_aspect) {
        newHeight = layerHeight;
        newWidth = layerHeight * source_asepct;
    } else {
        newWidth = layerWidth;
        newHeight = layerWidth / source_asepct;
    }

    var x = (newWidth - layerWidth) / 2;
    var y = (newHeight - layerHeight) / 2;

    layer.translate(
        new UnitValue(0 - x - layer.bounds[0].as('px'), 'px'),
        new UnitValue(0 - y - layer.bounds[1].as('px'), 'px')
    );

    app.activeDocument.activeLayer.resize((newWidth / width) * 100, (newHeight / height) * 100, AnchorPosition.TOPLEFT);

    app.preferences.rulerUnits = defaultRulerUnits;
}
