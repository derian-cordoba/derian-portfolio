export interface InquiryTransport {
  submit(
    url: string,
    body: URLSearchParams,
    signal: AbortSignal,
  ): Promise<boolean>;
}
