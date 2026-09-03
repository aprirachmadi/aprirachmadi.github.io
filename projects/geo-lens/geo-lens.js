(function () {
  "use strict";

  const base = "../../public/projects/geo-lens/";
  const image = (name, alt, className) => `<img src="${base}images/${name}" alt="${alt}" class="${className || "lens-image"}">`;
  const bar = (title, state) => `<div class="lens-scene__bar"><span>${title}</span><span class="lens-scene__live">${state}</span></div>`;

  const scenes = {
    comparison(target) {
      target.innerHTML = `<figure class="lens-scene"><div class="comparison">${image("later.png", "Later satellite observation of the representative LEVIR-CD test area", "lens-image comparison__later")}<div class="comparison__earlier">${image("earlier.png", "Earlier satellite observation of the same representative area")}</div><div class="comparison__divider" aria-hidden="true"></div><figcaption><span class="lens-label lens-label--left">A · Earlier</span><span class="lens-label lens-label--right">B · Later</span></figcaption></div></figure>`;
    },
    alignment(target) {
      target.innerHTML = `<figure class="lens-scene alignment-scene">${bar("Spatial correspondence", "Aligned pair")}<div class="alignment-plates"><div class="alignment-plate">${image("earlier.png", "Earlier satellite observation, aligned to a 1024 by 1024 coordinate grid")}<i class="alignment-crosshair" aria-hidden="true"></i></div><div class="alignment-plate">${image("later.png", "Later satellite observation, aligned to the same 1024 by 1024 coordinate grid")}<i class="alignment-crosshair" aria-hidden="true"></i></div><figcaption class="alignment-caption"><span>A · x,y</span><span>same pixel coordinates · B</span></figcaption></div></figure>`;
    },
    ambiguity(target) {
      target.innerHTML = `<figure class="lens-scene ambiguity-scene">${bar("Visible differences", "Interpret with care")}${image("later.png", "Later satellite observation with neutral outlines marking ambiguous visual differences")}<i class="ambiguity-mark" data-label="roof tone" style="left:17%;top:31%;width:14%;height:13%"></i><i class="ambiguity-mark" data-label="shadow" style="left:59%;top:19%;width:12%;height:16%"></i><i class="ambiguity-mark" data-label="vegetation" style="left:68%;top:61%;width:16%;height:13%"></i><figcaption class="lens-label lens-label--left">Neutral outline ≠ confirmed change</figcaption></figure>`;
    },
    model(target) {
      target.innerHTML = `<figure class="lens-scene architecture-scene">${bar("resnet18_siameseunet", "Evaluated checkpoint")}<img src="${base}architecture.svg" alt="Diagram: earlier and later images pass through one shared ResNet18 encoder; multi-scale absolute feature differences feed a U-Net decoder that outputs a 1024 by 1024 binary change mask."></figure>`;
    },
    prediction(target) {
      target.innerHTML = `<figure class="lens-scene prediction-scene">${bar("test_45 · stored prediction", "33.7291% coverage")}<div class="prediction-canvas">${image("later.png", "Later satellite observation for test sample 45")} ${image("prediction.png", "Stored predicted-change mask for test sample 45, colored fluorescent green and overlaid on the later image", "prediction-mask")}<i class="prediction-boundary" aria-hidden="true"></i><figcaption class="prediction-legend"><i></i>Fluorescent green = predicted change</figcaption></div></figure>`;
    },
    metrics(target) {
      target.innerHTML = `<section class="lens-scene metrics-scene" aria-label="Held-out test split evaluation metrics">${bar("128 image pairs · held-out test split", "Best validation checkpoint")}<div class="metric-grid"><article class="metric-pair metric-pair--tradeoff"><h3>Detection tradeoff</h3><div class="metric-values"><div><strong>0.7811</strong><span>Precision</span></div><div><strong>0.9204</strong><span>Recall</span></div></div></article><article class="metric-pair"><h3>Spatial overlap</h3><div class="metric-values"><div><strong>0.8451</strong><span>F1 / Dice</span></div><div><strong>0.7317</strong><span>IoU</span></div></div></article><article class="metric-pair"><h3>Pixel agreement</h3><div class="metric-values"><div><strong>0.9828</strong><span>Accuracy</span></div></div></article><article class="metric-pair"><h3>Evaluation objective</h3><div class="metric-values"><div><strong>0.9742</strong><span>Loss</span></div></div></article></div></section>`;
    },
    product(target) {
      target.innerHTML = `<figure class="lens-scene product-scene">${bar("Prediction interface", "FastAPI + Next.js")}<div class="product-window"><aside class="product-rail" aria-hidden="true"><div class="product-mark">G/L</div><span>Pair</span><span>Predict</span><span>Gallery</span></aside><div class="product-main"><div class="product-main__head"><span>test_45</span><span>overlay</span></div><div class="product-view">${image("later.png", "A representation of the Geo-Lens product canvas showing the later observation")}${image("prediction.png", "Stored predicted-change mask overlaid in green in the product canvas", "prediction-mask")}</div></div><aside class="product-telemetry"><dl><div><dt>Model</dt><dd>ResNet18 Siamese U-Net</dd></div><div><dt>Output</dt><dd>1024 × 1024</dd></div><div><dt>Coverage</dt><dd>33.7291%</dd></div><div><dt>Uploads</dt><dd>Memory only</dd></div></dl></aside></div><figcaption class="lens-label lens-label--left">Interface reconstruction from verified product capabilities</figcaption></figure>`;
    },
    limits(target) {
      target.innerHTML = `<section class="lens-scene limits-scene">${bar("Known failure modes", "Useful baseline")}<div class="limits-image">${image("later.png", "Later satellite observation with the stored prediction mask overlaid")}${image("prediction.png", "Stored predicted-change mask colored green", "prediction-mask")}</div><div class="limits-list"><h3>False positives can come from</h3><ul><li>Building boundaries</li><li>Illumination and shadows</li><li>Roof tone</li><li>Parallax</li><li>Other appearance changes</li></ul><p>Next: reduce false positives while preserving recall for small buildings.</p></div></section>`;
    }
  };

  Object.entries(scenes).forEach(([name, renderer]) => window.StoryScenes.register(name, renderer));
})();
