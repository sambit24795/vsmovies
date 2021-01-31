// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { HelloWorldPanel } from "./helloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { authenticate } from "./authenticate";
import { TokenManager } from "./TokenManager";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vsmovies" is now active!');

  TokenManager.globalState = context.globalState;

  console.log("getToken", TokenManager.getToken());

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(watch) Movies";
  item.command = "vsmovies.helloWorld";
  item.show();

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vsmovies-sidebar",
      sidebarProvider
    )
  );

  let disposable = vscode.commands.registerCommand(
    "vsmovies.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      HelloWorldPanel.createOrShow(context.extensionUri);
      /* vscode.window.showInformationMessage(
        "token is: " + TokenManager.getToken()
      ); */
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("vsmovies.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "Hello There!, How are you?",
        "good",
        "bad"
      );

      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that");
      } else {
        console.log({ answer });
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsmovies.refresh", async () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsmovies.authenticate", () => {
      //authenticate();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsmovies.addMovie", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      sidebarProvider._view?.webview.postMessage({
        type: "new movie",
        value: text,
      });
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
