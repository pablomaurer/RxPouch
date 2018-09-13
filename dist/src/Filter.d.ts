import { IModel } from "./interfaces/IModel";
export interface ISort {
    field: string;
    reverse: boolean;
}
export declare class Filter<T extends IModel> {
    private _docsSubject;
    private _allDocs;
    private _filter$?;
    private _filterType$?;
    private _sort$?;
    private _filter;
    private _filterType;
    private _comparator;
    private _sort;
    private _filteredDocs;
    constructor(_docsSubject: any, _allDocs: T[], _filter$?: any, _filterType$?: any, _sort$?: any);
    private filter;
    private doesDocPassFilter;
    sort(): T[];
    setFilter: (filter: any, filterType: any) => void;
    setSort: (sortDef: ISort) => void;
    extendComparator(comparator: any): void;
    getIndex(id: string): number;
    updateInStore(model: any): boolean;
    addToStore(model: any): boolean;
    removeFromStore(id: string): boolean;
}
