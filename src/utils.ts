import { ObservableMap, toJS } from "mobx";

export function debounce(n: number, fn: (...params: any[]) => any, immed: boolean = false) {
	let timer: number | undefined = undefined;
	return function (this: any, ...args: any[]) {
		if (timer === undefined && immed) {
			fn.apply(this, args);
		}
		clearTimeout(timer);
		timer = window.setTimeout(() => fn.apply(this, args), n);
		return timer;
	};
}

export class Guid {
	static v4(): string {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			let r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	static short(): string {
		let fst = (Math.random() * 46656) | 0;
		let snd = (Math.random() * 46656) | 0;
		let fstHalf = ("000" + fst.toString(36)).slice(-3);
		let sndHalf = ("000" + snd.toString(36)).slice(-3);
		return fstHalf + sndHalf;
	}
}

export namespace MapExt {
	export function isMap<K, V>(map: Map<K, V> | ObservableMap<K, V>): map is Map<K, V> {
		return map instanceof Map;
	}

	export function isObservalueMap<K, V>(map: Map<K, V> | ObservableMap<K, V>): map is ObservableMap<K, V> {
		return map instanceof ObservableMap;
	}

	export function map<K, V, RK, RV>(
		map: Map<K, V> | ObservableMap<K, V>,
		fn: (value: [K, V], index: number, array: [K, V][]) => [RK, RV]
	): Map<RK, RV> {
		if (isObservalueMap(map)) {
			let m = toJS(map);
			return new Map([...m].map(fn));
		}

		return new Map([...map].map(fn));
	}

	export function reduce<K, V, R>(
		map: Map<K, V> | ObservableMap<K, V>,
		fn: (acc: R, curr: [K, V], idx: number, src: [K, V][]) => R,
		initial: R
	): R {
		let m = isObservalueMap(map) ? toJS(map) : map;

		return Array.from(m).reduce((acc, curr, idx, src) => {
			return fn(acc, curr, idx, src);
		}, initial);
	}

	export function filter<K, V>(
		map: Map<K, V> | ObservableMap<K, V>,
		fn: (curr: [K, V], idx: number) => boolean
	): Map<K, V> | ObservableMap<K, V> {
		let m = isObservalueMap(map) ? toJS(map) : map;

		let filtered = Array.from(m).filter(fn);

		return isObservalueMap(map) ? new ObservableMap(filtered) : new Map(filtered);
	}

	export function toArray<K, V, R>(
		map: Map<K, V> | ObservableMap<K, V>,
		fn: (value: [K, V], index: number, array: [K, V][]) => R
	): Array<R> {
		if (isObservalueMap(map)) {
			let m = toJS(map);
			return [...m].map(fn);
		}

		return [...map].map(fn);
	}

	export function toSet<K, V, R>(
		map: Map<K, V> | ObservableMap<K, V>,
		fn: (value: [K, V], index: number, array: [K, V][]) => R
	): Set<R> {
		if (isObservalueMap(map)) {
			let m = toJS(map);
			return new Set([...m].map(fn));
		}

		return new Set([...map].map(fn));
	}
}

export namespace ArrayExt {
	export function intersect<T>(src: T[], target: T[]): T[] {
		return [...new Set(src)].filter((t) => new Set(target).has(t));
	}

	export function unique<T>(src: T[]): T[] {
		return [...new Set<T>(src)];
	}

	export function uniqueBy<T>(src: T[], by: (value: T, index?: number, array?: T[]) => any): T[] {
		let filtered = src.filter((v, i, a) => {
			return a.findIndex((value) => by(value) === by(v)) === i;
		});

		return [...new Set<T>(filtered)];
	}
}

export namespace ObjectExt {
	export function toMap<K, V>(o: Object): Map<K, V> {
		return new Map<K, V>(Object.entries(o) as any);
	}

	export function sortBy<T extends { [key: string]: number | string }>(sortBy: string, orderBy: "asc" | "desc") {
		return (s1: T, s2: T) => {
			let { fst, snd } = "asc" === orderBy ? { fst: s1, snd: s2 } : { fst: s2, snd: s1 };

			if (!fst.hasOwnProperty(sortBy) || !snd.hasOwnProperty(sortBy)) {
				return 0;
			}

			let fstValue = fst[sortBy];
			let sndValue = snd[sortBy];

			if (typeof fstValue === "string" && typeof sndValue === "string") {
				return fstValue.localeCompare(sndValue);
			}

			if (typeof fstValue === "number" && typeof sndValue === "number") {
				return Number(fstValue) - Number(sndValue);
			}
			return 0;
		};
	}

	export function toQueryString(o: { [key: string]: string | number | null | undefined }): string {
		let entries = (Object.entries(o).filter(([key, value]) => {
			return null !== value && undefined !== value;
		}) as unknown) as { [key: string]: string };

		let params = new URLSearchParams(entries);

		return params.toString();
	}
}
