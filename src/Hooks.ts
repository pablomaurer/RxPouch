export enum EHook {
  PRE_CREATE = "preCreate",
  POST_CREATE = "postCreate",
  PRE_UPDATE = "preUpdate",
  POST_UPDATE = "postUpdate",
  PRE_SAVE = "preSave",
  POST_SAVE = "postSave",
  PRE_REMOVE = "preRemove",
  POST_REMOVE = "postRemove",
}

export class Hook {

  private preCreate: ((doc: any) => any)[] = null;
  private postCreate: ((doc: any) => any)[] = null;

  private preUpdate: ((doc: any) => any)[] = null;
  private postUpdate: ((doc: any) => any)[] = null;

  private preSave: ((doc: any) => any)[] = null;
  private postSave: ((doc: any) => any)[] = null;

  private preRemove: ((doc: any) => any)[] = null;
  private postRemove: ((doc: any) => any)[] = null;

  constructor() {

  }

  public addHook(hookName: EHook|string, fn: ((doc: any) => any)) {
    if (!this[hookName]) {
      this[hookName] = [];
    }

    this.preCreate.push(fn);
  }

  public async runHooks(hookName: EHook|string, doc: any) {
    if (!this[hookName]) return doc;

    for (let fn of this[hookName]) {
      doc = await fn(doc);
    }

    return doc;
  }

}