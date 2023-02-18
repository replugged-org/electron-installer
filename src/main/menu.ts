import { BrowserWindow, Menu, MenuItemConstructorOptions, app, shell } from "electron";

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  public mainWindow: BrowserWindow;

  public constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  public buildMenu(): Menu {
    if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === "darwin" ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  public setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on("context-menu", (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  public buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: "Replugged Installer",
      submenu: [
        { label: "Services", submenu: [] },
        { type: "separator" },
        {
          label: "Hide Replugged Installer",
          accelerator: "Command+H",
          selector: "hide:",
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          selector: "hideOtherApplications:",
        },
        { label: "Show All", selector: "unhideAllApplications:" },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "Command+R",
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "Alt+Command+I",
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: "View",
      submenu: [
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "Command+M",
          selector: "performMiniaturize:",
        },
        { label: "Close", accelerator: "Command+W", selector: "performClose:" },
        { type: "separator" },
        { label: "Bring All to Front", selector: "arrangeInFront:" },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: "Help",
      submenu: [
        {
          label: "Replugged Website",
          click() {
            void shell.openExternal("https://replugged.dev");
          },
        },
        {
          label: "Discord",
          click() {
            void shell.openExternal("https://discord.gg/replugged");
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true"
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuView, subMenuWindow, subMenuHelp];
  }

  public buildDefaultTemplate(): MenuItemConstructorOptions[] {
    const templateDefault = [
      {
        label: "&File",
        submenu: [
          {
            label: "&Open",
            accelerator: "Ctrl+O",
          },
          {
            label: "&Close",
            accelerator: "Ctrl+W",
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true"
        ? {
            label: "&View",
            submenu: [
              {
                label: "&Reload",
                accelerator: "Ctrl+R",
                click: () => {
                  this.mainWindow.webContents.reload();
                },
              },
              {
                label: "Toggle &Full Screen",
                accelerator: "F11",
                click: () => {
                  this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                },
              },
              {
                label: "Toggle &Developer Tools",
                accelerator: "Alt+Ctrl+I",
                click: () => {
                  this.mainWindow.webContents.toggleDevTools();
                },
              },
            ],
          }
        : null,
      {
        label: "Help",
        submenu: [
          {
            label: "Replugged Website",
            click() {
              void shell.openExternal("https://replugged.dev");
            },
          },
          {
            label: "Discord",
            click() {
              void shell.openExternal("https://discord.gg/replugged");
            },
          },
        ],
      },
    ];

    return templateDefault.filter(Boolean) as MenuItemConstructorOptions[];
  }
}
