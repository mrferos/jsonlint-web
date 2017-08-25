import React, { Component } from 'react';
import './App.css';
import { parse, parser } from './utils/json/jsonlint';
import { formatter } from './utils/json/formatter';
import classHelper from './utils/class';

const defaultContent = 'Paste json...';

class App extends Component {
  onFocus(e) {
    const content = e.currentTarget.textContent;
    if (content === defaultContent) {
      e.currentTarget.textContent = '';
    }
  }

  onKeyDown(e) {
      if (e.keyCode !== 9) {
        return;
      }

      e.preventDefault(); 
      const jsonElement = document.getElementById('json');
      const contents = jsonElement.innerHTML;
      const selection = document.getSelection();
      const indexRange = selection.getRangeAt(0).cloneRange();
      const { startOffset } = indexRange;
      const { anchorNode, anchorOffset, focusNode, foscusOffset } = selection;
      jsonElement.innerHTML = contents.substring(0, selection.anchorOffset) + "\t" + contents.substring(selection.anchorOffset);

      indexRange.setStart(jsonElement.childNodes[0], startOffset + 1);
      selection.removeAllRanges(); 
      selection.addRange(indexRange);
      selection.collapse(anchorNode, anchorOffset);
      selection.extend(focusNode, foscusOffset); 
  }

  doLint() {
    const jsonElement = document.getElementById('json');
    const jsonString = jsonElement.innerHTML;
    const lintButton = document.getElementById('lintButton');

    try {
      const parsed = parse(jsonString);
      jsonElement.innerHTML = JSON.stringify(parsed, null, "    ");
      classHelper.removeClass(lintButton, 'lint-error');
      if (!classHelper.hasClass(lintButton, 'lint-good')) {
        classHelper.addClass(lintButton, 'lint-good');
      }

    } catch (e) { 
      console.log(e);
      classHelper.removeClass(lintButton, 'lint-good');
      if (!classHelper.hasClass(lintButton, 'lint-error')) {
        classHelper.addClass(lintButton, 'lint-error');
      }

      const manuallyFormatted = formatter.formatJson(jsonString, "    ");
      try {
        parser.parse(manuallyFormatted);
      } catch (e) { 
        jsonElement.innerHTML = manuallyFormatted;
      }
    }
  }

  render() {
    return (
      <div>
        <pre id="json" contentEditable onFocus={ this.onFocus } onKeyDown={ this.onKeyDown.bind(this) }>{ defaultContent }</pre>
        <div id="lintButton">
          <button onClick={ this.doLint }>Lint.</button>
        </div>
      </div>
    );
  }
} 

export default App;
 
