(function () {
  "use strict";
  document.querySelectorAll('template[id^="scene-dispatch-"]').forEach((template) => {
    window.StoryScenes.register(template.id.replace("scene-", ""), (target) => {
      target.appendChild(template.content.cloneNode(true));
    });
  });
})();
