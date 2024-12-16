/* This should be loaded:
 *   - after scratchblocks.js
 *   - after markitup.js
 *   - after scratchblocks._currentLanguage is set
 *   - before markItUp() is run
 *   - before any scratchblocks.parse() calls
 */

/*
 * based on refactor 07/03/2024 for 3.0 blocks by @grahamsh
 */


function capitalise(text) {
  return text[0].toUpperCase() + text.slice(1);
}

var scratchblocksMenu;
mySettings.markupSet.forEach(function (item) {
  if (item.name === "Scratchblocks") scratchblocksMenu = item;
});

var code = scratchblocks._currentLanguages.slice().pop();
var language = scratchblocks.allLanguages[code];
function palette(name) {
  if (!language.palette) return capitalise(name);
  return (language.palette[capitalise(name)] || language.palette[name]) || capitalise(name); // fall back to english, better than undefined
}

var blocks = {
  motion: [
    "move (...) steps",
    "turn cw (...) degrees",
    "turn ccw (...) degrees",
    "point in direction (... v)",
    "point towards [... v]",
    "go to x: (...) y: (0)",
    "go to [... v]",
    "glide (...) secs to x: (0) y: (0)",
    "change x by (...)",
    "set x to (...)",
    "change y by (...)",
    "set y to (...)",
    "if on edge, bounce",
    "set rotation style [... v]",
    "(x position)",
    "(y position)",
    "(direction)",
  ],
  looks: [
    "say [...] for (2) secs",
    "say [...]",
    "think [...] for (2) secs",
    "think [...]",
    "show",
    "hide",
    "switch costume to [... v]",
    "next costume",
    "switch backdrop to [... v]",
    "switch backdrop to [... v] and wait",
    "next backdrop",
    "change [... v] effect by (25)",
    "set [... v] effect to (0)",
    "clear graphic effects",
    "change size by (...)",
    "set size to (...) %",
    "go to [front v] layer",
    "go [forward v] (1) layers",
    "(costume [number v])",
    "((backdrop [number v]::looks)",
    "(size)",
  ],
  sound: [
    "play sound [... v]",
    "play sound [... v] until done",
    "stop all sounds",
    "change [pitch v] effect by (10)",
    "set [pitch v] effect to (100)",
    "clear sound effects",
    "change volume by (...)",
    "set volume to (...) %",
    "(volume)",
    "play drum (... v) for (0.25) beats",
    "rest for (...) beats",
    "play note (... v) for (0.5) beats",
    "set instrument to (... v)",
    "change tempo by (...)",
    "(tempo)",
  ],
  events: [
    "when green flag clicked",
    "when [... v] key pressed",
    "when this sprite clicked",
    "when backdrop switches to [... v]",
    "when [... v] > (10)",
    "when I receive [... v]",
    "broadcast [... v]",
    "broadcast [... v] and wait",
  ],
  control: [
    "wait (...) secs",
    "repeat (...)\nend",
    "forever\nend",
    "if <> then\nend",
    "if <> then \n  \nelse\nend",
    "wait until <>",
    "repeat until <>\nend",
    "stop [... v]",
    "when I start as a clone",
    "create clone of [... v]",
    "delete this clone",
  ],
  sensing: [
    "<touching [... v] ?>",
    "<touching color [#1b37da] ?>",
    "<color [#cbdbf5] is touching [#49e84b] ?>",
    "(distance to [... v])",
    "ask [...] and wait",
    "(answer)",
    "<key [... v] pressed?>",
    "<mouse down?>",
    "(mouse x)",
    "(mouse y)",
    "set drag mode to [draggable v] :: sensing",
    "(loudness)",
    "(timer)",
    "reset timer",
    "([... v] of [Sprite1 v])",
    "(current [... v])",
    "(days since 2000)",
    "(username)",
  ],
  operators: [
    "((...) + (0))",
    "((...) - (0))",
    "((...) * (0))",
    "((...) / (0))",
    "((...) - (0))",
    "(pick random (...) to (10))",
    "((...) - (0))",
    "<[...] < []>",
    "<[...] = []>",
    "<[...] > []>",
    "<<> and <>>",
    "<<> or <>>",
    "<not <>>",
    "(join [...] [world])",
    "(letter (...) of [world])",
    "(length of [...])",
    "<[] contains []?>",
    "((...) mod (0))",
    "(round (...))",
    "([abs v] of (9)::operators)",
  ],
  variables: [
    "(foo)",
    "(☁ score)",
    "set [... v] to []",
    "change [... v] by (0)",
    "show variable [... v]",
    "hide variable [... v]",
    "(list :: list)",
    "add [...] to [list v]",
    "delete (... v) of [list v]",
    "delete all of [list v]",
    "insert [...] at (1 v) of [list v]",
    "replace item (... v) of [list v] with [thing]",
    "(item (... v) of [list v] :: list)",
    "(item # of [] in [list v])",
    "(length of [... v] :: list)",
    "<[... v] contains [thing] ?>",
    "show list [... v]",
    "hide list [... v]",
  ],
  video: [
    "when video motion > (10)",
    "(video [... v] on [Stage v])",
    "turn video [... v]",
    "set video transparency to (...) %",
  ],
  pen: [
    "clear",
    "stamp",
    "pen down",
    "pen up",
    "set pen color to [#01a15b]",
    "change pen color by (...)",
    "set pen color to (...)",
    "change pen shade by (...)",
    "set pen shade to (...)",
    "change pen size by (...)",
    "set pen size to (...)",
  ]
};

var currentCategory = null;
var currentSubMenu = null;

for (var category in blocks) {
  currentSubMenu = {
    name: palette(category) + " :: " + category,
    dropMenu: blocks[category].map(function (block) {
      let display = block;
      if (language != 'en') {
        const newBlock = scratchblocks.parse(block)
        newBlock.translate(language);
        display = newBlock.stringify();
      }
      const el = document.createElement("div");
      el.textContent = display;
      var offset = 0;
      var splitIndex = block.indexOf("...");
      if (splitIndex !== -1) {
        offset = 3;
      } else {
        splitIndex = block.indexOf("\n");
        if (splitIndex !== -1) {
          splitIndex++;
        }
      }
      const cleanBlock = block.replace(/\n/g, "\n\n");

      if (splitIndex === -1) {
        return {
          name: el.innerHTML,
          replaceWith: cleanBlock,
        };
      } else {
        return {
          name: el.innerHTML,
          openWith: cleanBlock.slice(0, splitIndex),
          closeWith: cleanBlock.slice(splitIndex + offset),
        };
      }
    }),
  };

  scratchblocksMenu.dropMenu.push(currentSubMenu);
}

scratchblocksMenu.dropMenu.push({
  name: palette("My Blocks") + " :: custom",
  dropMenu: [
    { name: language.definePrefix, openWith: language.definePrefix + " " },
    { name: "(input ::custom)", openWith: "(", closeWith: ")" },
  ],
});

mySettings.beforeInsert = function (h) {
  h.originalSelection = h.selection;
};

mySettings.afterInsert = function (h) {
  if (
    !(h.hasOwnProperty("openWith") || h.hasOwnProperty("replaceWith")) ||
    $.inArray(h.name, [
      "Bold",
      "Italic",
      "Underline",
      "Stroke",
      "Picture",
      "Link",
      "Size",
      "Big",
      "Small",
      "Bulleted list",
      "Numeric list",
      "List item",
      "Quotes",
      "Smiles",
      "Smile",
      "Neutral",
      "Sad",
      "Big smile",
      "Yikes",
      "Wink",
      "Hmm",
      "Tongue",
      "Lol",
      "Mad",
      "Roll",
      "Cool",
      "Clean",
      "Preview",
      "Paste browser / operating system versions",
    ]) > -1
  ) {
    return;
  }

  var contents = $(h.textarea).attr("value"),
    cursor,
    originalCursor,
    lineStartCursor,
    OPEN_BRACKETS = "<([",
    CLOSE_BRACKETS = "])>";

  if ("selectionStart" in h.textarea) {
    cursor = h.textarea.selectionStart;
  } else if ("selection" in document) {
    h.textarea.focus();
    var sel = document.selection.createRange();
    var selLength = document.selection.createRange().text.length;
    sel.moveStart("character", -h.textarea.value.length);
    cursor = sel.text.length - selLength;
  }
  originalCursor = cursor;

  // Are we inserting inside a line?
  if (h.caretPosition > 0 && contents.charAt(h.caretPosition - 1) !== "\n") {
    var inserted = h.replaceWith || h.openWith + (h.closeWith || "");
    var open = h.replaceWith || h.openWith;

    if (h.originalSelection) {
      // Consume surrounding brackets.
      var testIndex = h.caretPosition,
        endIndex = testIndex + inserted.length + h.originalSelection.length;
      var charBefore = contents.charAt(testIndex - 1),
        charAfter = contents.charAt(endIndex);
      if (
        OPEN_BRACKETS.indexOf(charBefore) > -1 &&
        CLOSE_BRACKETS.indexOf(charAfter) > -1
      ) {
        contents =
          contents.slice(0, testIndex - 1) +
          contents.slice(testIndex, endIndex) +
          contents.slice(endIndex + 1);
        originalCursor -= 1;
      }
    } else {
      contents =
        contents.slice(0, h.caretPosition) +
        contents.slice(h.caretPosition + inserted.length);

      if (
        contents.charAt(h.caretPosition) === "\n" &&
        !contents.charAt(h.caretPosition - 1) === "\n"
      ) {
        // At end of line. Insert newline
        contents =
          contents.slice(0, h.caretPosition) +
          "\n" +
          inserted +
          contents.slice(h.caretPosition);
        h.caretPosition += 1;
        originalCursor += 1;
      } else {
        // Inside line. Remove block and add on a new line.
        if (OPEN_BRACKETS.indexOf(inserted.charAt(0)) === -1) {
          // stack block
          // Look for newline
          var eol = h.caretPosition;
          while (contents.charAt(eol) !== "\n" && eol <= contents.length) {
            eol += 1;
          }

          contents =
            contents.slice(0, eol) + "\n" + inserted + contents.slice(eol);
          originalCursor = eol + open.length + 1;
        } else {
          // reporter block
          // Consume surrounding brackets.
          var testIndex = h.caretPosition;
          var charBefore = contents.charAt(testIndex - 1),
            charAfter = contents.charAt(testIndex);
          if (
            OPEN_BRACKETS.indexOf(charBefore) > -1 &&
            CLOSE_BRACKETS.indexOf(charAfter) > -1
          ) {
            contents =
              contents.slice(0, testIndex - 1) + contents.slice(testIndex + 1);
            testIndex -= 1;
            originalCursor -= 1;
          }

          contents =
            contents.slice(0, testIndex) + inserted + contents.slice(testIndex);
        }
      }
    }
  }

  // Look for scratchblocks tag
  cursor -= 15;
  while (
    !/\[\/?scratchblocks\]/.test(contents.slice(cursor, originalCursor)) &&
    cursor >= 0
  ) {
    cursor -= 1;
  }

  // Insert scratchblocks tag if needed
  if (!/\[scratchblocks\]/.test(contents.slice(cursor, originalCursor))) {
    contents =
      contents.slice(0, h.caretPosition) +
      "[scratchblocks]\n" +
      contents.slice(h.caretPosition);
    contents += "\n[/scratchblocks]";
    originalCursor += 16;
  }

  $(h.textarea).attr("value", contents);

  if (h.textarea.setSelectionRange) {
    h.textarea.focus();
    h.textarea.setSelectionRange(originalCursor, originalCursor);
  } else if (h.textarea.createTextRange) {
    var range = h.textarea.createTextRange();
    range.collapse(true);
    range.moveEnd("character", originalCursor);
    range.moveStart("character", originalCursor);
    range.select();
  }
};
