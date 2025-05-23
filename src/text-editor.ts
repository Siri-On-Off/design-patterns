interface EditorState {
  getLabel(): string;
  handleInput(): EditorState;
  save(content: string): EditorState;
  saveAs(content: string): EditorState;
  newFile(): EditorState;
  getFilename(): string | undefined;
}

class EditorContext {
  private state: EditorState;
  private textArea: HTMLTextAreaElement;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
    this.state = new CleanUnsavedState(this);
    this.updateLabel();
  }

  setState(state: EditorState) {
    this.state = state;
    this.updateLabel();
  }

  private updateLabel() {
    setStateLabel(this.state.getLabel());
  }

  handleInput() {
    this.setState(this.state.handleInput());
  }

  save() {
    const content = this.textArea.value;
    this.setState(this.state.save(content));
  }

  saveAs() {
    const content = this.textArea.value;
    this.setState(this.state.saveAs(content));
  }

  newFile() {
    this.textArea.value = "";
    this.setState(this.state.newFile());
  }

  openFile(filename: string, content: string) {
    this.textArea.value = content;
    this.setState(new CleanSavedState(this, filename));
  }
}

class CleanUnsavedState implements EditorState {
  constructor(private ctx: EditorContext) {}

  getLabel() {
    return "_";
  }
  handleInput() {
    return new DirtyUnsavedState(this.ctx);
  }
  save(content: string) {
    return this.saveAs(content);
  }
  saveAs(content: string) {
    let filename = prompt("Enter a File Name", "");
    if (filename?.trim()) {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      showFiles(listFiles(), "files-list");
      return new CleanSavedState(this.ctx, filename);
    }
    return this;
  }
  newFile() {
    return new CleanUnsavedState(this.ctx);
  }
  getFilename() {
    return undefined;
  }
}

class DirtyUnsavedState implements EditorState {
  constructor(private ctx: EditorContext) {}

  getLabel() {
    return "*";
  }
  handleInput() {
    return this;
  }
  save(content: string) {
    return this.saveAs(content);
  }
  saveAs(content: string) {
    let filename = prompt("Enter a File Name", "");
    if (filename?.trim()) {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      showFiles(listFiles(), "files-list");
      return new CleanSavedState(this.ctx, filename);
    }
    return this;
  }
  newFile() {
    return new CleanUnsavedState(this.ctx);
  }
  getFilename() {
    return undefined;
  }
}

class CleanSavedState implements EditorState {
  constructor(
    private ctx: EditorContext,
    private filename: string
  ) {}

  getLabel() {
    return this.filename;
  }

  handleInput() {
    return new DirtySavedState(this.ctx, this.filename);
  }

  save(content: string) {
    localStorage.setItem(this.filename, content);
    showFiles(listFiles(), "files-list");
    return this;
  }

  saveAs(content: string) {
    let filename = prompt("Enter a File Name", "");
    if (filename?.trim()) {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      showFiles(listFiles(), "files-list");
      return new CleanSavedState(this.ctx, filename);
    }
    return this;
  }

  newFile() {
    return new CleanUnsavedState(this.ctx);
  }

  getFilename() {
    return this.filename;
  }
}

class DirtySavedState implements EditorState {
  constructor(
    private ctx: EditorContext,
    private filename: string
  ) {}

  getLabel() {
    return `${this.filename} *`;
  }

  handleInput() {
    return this;
  }

  save(content: string) {
    localStorage.setItem(this.filename, content);
    showFiles(listFiles(), "files-list");
    return new CleanSavedState(this.ctx, this.filename);
  }

  saveAs(content: string) {
    let filename = prompt("Enter a File Name", "");
    if (filename?.trim()) {
      if (!filename.endsWith(".txt")) filename += ".txt";
      localStorage.setItem(filename, content);
      showFiles(listFiles(), "files-list");
      return new CleanSavedState(this.ctx, filename);
    }
    return this;
  }

  newFile() {
    return new CleanUnsavedState(this.ctx);
  }

  getFilename() {
    return this.filename;
  }
}

const textArea = document.getElementById("text") as HTMLTextAreaElement;

document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("text") as HTMLTextAreaElement;
  const editor = new EditorContext(textArea);

  textArea.addEventListener("input", () => editor.handleInput());

  document
    .getElementById("save-button")
    .addEventListener("click", () => editor.save());
  document
    .getElementById("save-as-button")
    .addEventListener("click", () => editor.saveAs());
  document
    .getElementById("new-button")
    .addEventListener("click", () => editor.newFile());

  showFiles(listFiles(), "files-list", (filename, content) => {
    editor.openFile(filename, content);
  });

  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
    return false;
  });
});

function setStateLabel(value: string) {
  const stateLabel = document.getElementById("state-label");
  stateLabel.innerText = value;
}

function showFiles(
  files: string[],
  parentId: string,
  onClick?: (filename: string, content: string) => void
) {
  const parent = document.getElementById(parentId);
  while (parent.firstChild) parent.removeChild(parent.firstChild);
  for (const file of files) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.innerHTML = file;
    item.appendChild(link);
    parent.append(item);
    link.addEventListener("click", () => {
      const content = localStorage.getItem(file);
      if (onClick) onClick(file, content);
    });
  }
}

function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    files.push(localStorage.key(i));
  }
  return files;
}
