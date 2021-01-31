import * as vscode from "vscode";
import * as polka from "polka";
import { apiBaseUrl } from "./constants";
import { TokenManager } from "./TokenManager";

export const authenticate = (cb: () => void) => {
  const app = polka();

  app.get(`auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`<h1>Something went wrong!</h1>`);
      return;
    }

    await TokenManager.setToken(token);
    cb();
    res.end(`<h1>auth was successful</h1>`);
    app.server?.close();
  });

  app.listen(54321, (err: any) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
};
