// ==UserScript==
// @name          GitHub Notifications - Arrow key navigation
// @description   Allow navigating through the GitHub notifications screen using your keyboard arrow keys
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/github-notifications-arrow-key-navigation/github-notifications-arrow-key-navigation.user.js
// @namespace     https://www.devalias.net/
// @version       1.0
// @match         https://github.com/notifications
// @grant         none
// ==/UserScript==

// TODO: link to all of my issues on refined-github as reference:
//   https://github.com/refined-github/refined-github/issues?q=is%3Aissue+author%3A0xdevalias+sort%3Aupdated-desc

// TODO: can we also make the 'O' key open all selected issues, and not just the 1 currently highlighted one?
//   This should only happen when we have multiple notifications selected though..
//   Seems we can define a hotkey on the 'Open all' button just by setting it's attribute: data-hotkey='O'
//     Though we may have to prevent any other configured 'O' hotkey from running in that instance..
//   When I suggested this on refined-github, they talked about using the 'n' key for this.
//     See https://github.com/refined-github/refined-github/issues/6273

// TODO: It would be cool if we could mark all of the selected items as read/unread using keyboard shortcuts:
//   The buttons seem to be form submit buttons that make POST requests to:
//     /notifications/beta/mark
//     /notifications/beta/unmark
//   The focused(?) notification can be marked as read/unread with shift-I (or y) / shift-U
//     We can see these keyboard shortcuts in the data-hotkey attribute on the buttons
//   It seems this already works for all of the selected items!!

// TODO: it would also be really useful if these keyboard shortcuts worked when we currently have a checkbox highlighted
//   eg. when we have just ticked a single entry, and then want to move up/down to select more of them
//     It seems that commenting out this may make that work? if (event.target.tagName !== 'BODY') return;
//         I think commenting this out breaks functionality of the arrow keys when within a textbox/similar though..
//       Though even though I can move the 'currently active' icon around, it seems that I can't use 'X' to
//       select items until I 'click off' onto the 'body' of the page again..?

// TODO: it would be nice if the 'currently selected' item was updated to the item we recently 'ticked' when we click on a checkbox
//   Currently it seems as though it just stays on whatever item was previously highlighted/'active', which feels confusing.

// https://github.com/refined-github/refined-github/blob/main/contributing.md#reverse-engineering-github
//   Reverse-engineering GitHub
// d = Node.prototype.dispatchEvent;
// Node.prototype.dispatchEvent = function (...a) {
//  console.log(...a);
//  // debugger; // Uncomment when necessary
//  d.apply(this, a);
// };

// Ref: https://github.githubassets.com/assets/node_modules/delegated-events/dist/index.js
// function fire(target, name, detail) {
//   return target.dispatchEvent(new CustomEvent(name, {
//     bubbles: true,
//     cancelable: true,
//     detail: detail
//   }));
// }

// const name = 'navigation:keydown';
// const target = TODO;
// const detail = {
//   hotkey: 'j',
//   originalEvent: TODO,
//   originalTarget: TODO,
// }

// const name = 'navigation:focus';
// const target = TODO;
// const detail = undefined

const notificationsListElement = document.querySelector('.notifications-list ul');

notificationsListElement.addEventListener('change', (event) => {
  if (event.target.tagName != 'INPUT') return
  if (event.target.type != 'checkbox') return

  // Remove focus from the checkbox so we can continue navigating the page using keyboard shortcuts
  event.target.blur()

  const notificationListItem = event.target.closest('li.notifications-list-item');

  if (!notificationListItem) {
    console.warn("Couldn't find parent .notifications-list-item.. can't focus it.")
    return
  }

  // This CustomEvent check is used to skip focusing when 'select all' is clicked
  const isSelectAllChangeEvent =
    event instanceof CustomEvent &&
    event.detail &&
    event.detail.relatedTarget &&
    event.detail.relatedTarget.classList.contains('js-notifications-mark-all-prompt')

  if (!isSelectAllChangeEvent) {
    const currentlyFocused = notificationsListElement.querySelector('.navigation-focus')
    if (currentlyFocused) {
      // console.log('Found currently focused notification.. clearing it:', currentlyFocused)
      currentlyFocused.classList.remove('navigation-focus')
    }

    // TODO: When using the 'select all' checkbox, this is a little visually janky..
    //   it would be ideal if we didn't try to focus things when using 'select all'
    //     Seems to use .js-notifications-mark-all-prompt class on the 'select all'
    //     Can see the logic for the code at: https://github.githubassets.com/assets/node_modules/@github/check-all/dist/index.js
    //       onCheckAll calls setChecked on each matching element
    //       setChecked seems to raise a CustomEvent 'change', which also sets detail : { relatedTarget: target }
    //         Potentially we can skip focusing when the event looks like that..?
    //         It seems that the relatedTarget is set to the 'select all' checkbox: input.js-notifications-mark-all-prompt
    //   Technically we have implemented this check now.. though might be cool to capture the above context somewhere for future reference..
    // console.log('Focusing current checkbox:', notificationListItem)
    notificationListItem.classList.add('navigation-focus')
  }
  // else {
  //   console.log('Skipping select all change event:', event)
  // }
});

document.addEventListener('keydown', (event) => {
  // console.log(event.target)

  const isTargetBody = event.target.tagName === 'BODY';
  const isTargetCheckbox = event.target.tagName === 'INPUT' && event.target.type === 'checkbox';

  if (!(isTargetBody || isTargetCheckbox)) return;

  // TODO: not sure if there is actually any benefit to this code being here now that we have the on change event handler doing it for us..?
  // if (isTargetCheckbox) {
  //   console.log('Focussing current checkbox:', event.target)
  //   fire(event.target, 'navigation:focus')
  // }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    event.stopPropagation();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', bubbles: true }));
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault();
    event.stopPropagation();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', code: 'KeyJ', bubbles: true }));
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    event.stopPropagation();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', code: 'KeyH', bubbles: true }));
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault();
    event.stopPropagation();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', code: 'KeyL', bubbles: true }));
  }
}, { capture: true });
