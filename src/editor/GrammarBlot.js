import { Quill } from "react-quill";

// Import the Inline blot (formatting that wraps text like bold/italic)
const Inline = Quill.import("blots/inline");

class GrammarBlot extends Inline {
  static create(value) {
    let node = super.create();
    node.setAttribute("title", "Grammar Issue"); // Tooltip on hover
    return node;
  }
}

// 1. MUST match the string used in your formats array in CreateBlogPage
GrammarBlot.blotName = "grammarError"; 
// 2. The HTML tag to wrap the text in
GrammarBlot.tagName = "span";           
// 3. The CSS class to apply for styling
GrammarBlot.className = "grammar-error"; 

Quill.register(GrammarBlot);

export default GrammarBlot;