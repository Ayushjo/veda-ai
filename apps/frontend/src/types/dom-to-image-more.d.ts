declare module 'dom-to-image-more' {
  interface Options {
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    bgcolor?: string;
    cacheBust?: boolean;
  }

  function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  function toPng(node: HTMLElement, options?: Options): Promise<string>;
  function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  function toSvg(node: HTMLElement, options?: Options): Promise<string>;

  export default { toBlob, toPng, toJpeg, toSvg };
}
