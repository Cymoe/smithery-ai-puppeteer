import { MCPServer } from '@smithery/types';
import puppeteer from 'puppeteer';

interface PuppeteerConfig {
  headless?: boolean;
  defaultViewport?: {
    width: number;
    height: number;
  };
}

export default class PuppeteerMCP implements MCPServer {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;
  private config: PuppeteerConfig;

  constructor(config: PuppeteerConfig = {}) {
    this.config = {
      headless: true,
      defaultViewport: { width: 1280, height: 720 },
      ...config
    };
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch(this.config);
    this.page = await this.browser.newPage();
  }

  async shutdown(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async handleRequest(method: string, params: any): Promise<any> {
    if (!this.page) throw new Error('Browser not initialized');

    switch (method) {
      case 'goto':
        return await this.page.goto(params.url);
      case 'screenshot':
        return await this.page.screenshot(params);
      case 'content':
        return await this.page.content();
      case 'evaluate':
        return await this.page.evaluate(params.script);
      case 'type':
        return await this.page.type(params.selector, params.text);
      case 'click':
        return await this.page.click(params.selector);
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
}