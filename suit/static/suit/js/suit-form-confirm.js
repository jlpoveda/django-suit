/**
 * Determines if a form is dirty by comparing the current value of each element
 * with its default value.
 *
 * @param {Form} form the form to be checked.
 * @return {Boolean} <code>true</code> if the form is dirty, <code>false</code>
 *                   otherwise.
 *
 * Taken from here: http://stackoverflow.com/a/155812/641263
 */
let confirmExitIfModified = (function() {
  function isElementInsideW2uiGrid(element) {
    if (element.parentElement) {
      const parent = element.parentElement;
      if (parent.classList.contains("w2ui-grid")) {
        return true;
      }
      return isElementInsideW2uiGrid(parent);
    }
    return false;
  }

  function formIsDirty(formSource) {
    const form = [];
    for (let i = 0; i < formSource.elements.length; i++) {
      if (!isElementInsideW2uiGrid(formSource.elements[i])) {
        form.push(formSource.elements[i]);
      }
    }

    for (let i = 0; i < form.length; i++) {
      let element = form[i];

      let type = element.type;
      if (type === "checkbox" || type === "radio") {
        if (element.checked !== element.defaultChecked) {
          return true;
        }
      } else if (
        type === "hidden" ||
        type === "password" ||
        type === "text" ||
        type === "textarea"
      ) {
        var cls = element.getAttribute("class");
        if (!cls) cls = "";
        if (
          element.value !== element.defaultValue &&
          // Fix for select2 multiple
          cls.indexOf("select2") === -1 &&
          // Skip elements with ignore-changes class
          cls.indexOf("ignore-changes") === -1
        ) {
          return true;
        }
      } else if (type === "select-one" || type === "select-multiple") {
        for (let j = 0; j < element.options.length; j++) {
          if (
            element.options[j].selected !== element.options[j].defaultSelected
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  let submit = false;
  return function(form_id, message) {
    const form = document.forms[form_id];
    if (form) {
      form.onsubmit = function(e) {
        e = e || window.event;
        submit = true;
      };
    }
    window.onbeforeunload = function(e) {
      e = e || window.event;
      if (!submit && formIsDirty(form)) {
        // For IE and Firefox
        if (e) {
          e.returnValue = message;
        }
        // For Safari
        return message;
      }
    };
  };
})();
