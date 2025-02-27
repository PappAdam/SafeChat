import {
  ClientPackage,
  ClientPackageDescription,
  ServerAcknowledgement,
  ServerHeaderType,
  ServerPackage,
} from '../../../../../types';
import * as msgpack from '@msgpack/msgpack';
const URL: string = 'ws://localhost:8080';

export type PendingPackage = {
  dependsOn: string;
  pkg?: {
    encoded: Uint8Array<ArrayBufferLike>;
    uuid: string;
  };
  callback?: () => void;
};

/**
 * A class for managing WebSocket communication, including sending client packages,
 * handling server responses, and managing pending packages that depend on acknowledgements.
 *
 * @example
 *
 * // Register an initialization callback
 * sender.onInit(() => {
 *   console.log('WebSocket connection opened');
 * });
 *
 * // Register a callback for handling incoming "NewMessage" packages
 * sender.onPackage('NewMessage', (pkg: ServerNewMessagePackage) => {
 *   console.log('New message received:', pkg.messageContent);
 * });
 *
 * // Register a callback for handling incoming "Acknowledgement" packages
 * sender.onPackage('Acknowledgement', (pkg: ServerAcknowledgement) => {
 *   console.log('Acknowledgement received for message ID:', pkg.ackMessageId);
 * });
 *
 * // Send a "NewMessage" package
 * const newMessagePackage: ClientNewMessagePackage = {
 *   header: 'NewMessage',
 *   chatId: '12345',
 *   messageContent: 'Hello, World!'
 * };
 * const messageId = sender.sendPackage(newMessagePackage);
 * console.log('Sent message with ID:', messageId);
 *
 * // Create a pending package that waits for an acknowledgement
 * const pendingId = sender.createPending('id-from-package', newMessagePackage, () => {
 *   console.log('Acknowledgement received, pending package processed');
 * });
 * console.log('Created pending package with ID:', pendingId);
 */
class PackageSender {
  private ws: WebSocket;
  private pendingPackages: PendingPackage[] = [];
  private initializerEvents: (() => void)[] = [];

  private packageEvents: {
    header: ServerHeaderType;
    callback: (pkg: ServerPackage) => void;
  }[] = [];

  /**
   * Creates a new PackageSender instance.
   * @param {string} URL - The WebSocket server URL to connect to.
   */
  constructor(URL: string) {
    this.ws = new WebSocket(URL);
    this.ws.onmessage = this.onIncomingPackage;

    this.ws.onopen = () => {
      this.initializerEvents.forEach((initEvent) => {
        initEvent();
      });
    };

    this.onPackage('Acknowledgement', (pkg) => {
      const incoming = pkg as ServerAcknowledgement;
      const ackMessageId = incoming.ackMessageId;

      const packagesToProcess = this.pendingPackages.filter(
        (pp) => pp.dependsOn === ackMessageId
      );
      packagesToProcess.forEach((pp) => {
        pp.callback?.();
        if (pp.pkg) {
          this.ws.send(pp.pkg.encoded);
        }
      });

      this.pendingPackages = this.pendingPackages.filter(
        (pp) => pp.dependsOn !== ackMessageId
      );
    });
  }

  /**
   * Registers a callback to be executed when the WebSocket connection is opened.
   * @param {() => void} callback - The callback function to execute on connection open.
   */
  onInit(callback: () => void) {
    this.initializerEvents.push(callback);
  }

  /**
   * Registers a callback to handle incoming packages with a specific header.
   * @param {ServerHeaderType} header - The header to listen for.
   * @param {(pkg: ServerPackage) => void} callback - The callback to execute when a package with the specified header is received.
   */
  onPackage(header: ServerHeaderType, callback: (pkg: ServerPackage) => void) {
    const event = {
      header: header,
      callback: callback,
    };

    this.packageEvents.push(event);
  }

  /**
   * Handles incoming WebSocket messages.
   * @param {MessageEvent} socketMessage - The incoming WebSocket message.
   * @private
   */
  private onIncomingPackage = async (socketMessage: MessageEvent) => {
    const incoming = msgpack.decode(
      await (socketMessage.data as any).arrayBuffer()
    ) as ServerPackage;

    const event = this.packageEvents.find((ev) => ev.header == incoming.header);
    if (event) {
      event.callback(incoming);
    }
  };

  /**
   * Sends a package to the WebSocket server.
   * @param {ClientPackageDescription} packageDesc - The package description to send.
   * @returns {string} The UUID of the sent package.
   */
  sendPackage(packageDesc: ClientPackageDescription): string {
    const pkg = PackageSender.wrapPackage(packageDesc);
    this.ws.send(pkg.encoded);

    return pkg.uuid;
  }

  createPending(dependsOn: string): string | null;
  createPending(
    dependsOn: string,
    packageDesc: ClientPackageDescription
  ): string | null;
  createPending(dependsOn: string, callback: () => void): string | null;
  createPending(
    dependsOn: string,
    packageDesc: ClientPackageDescription,
    callback: () => void
  ): string | null;

  /**
   * Creates a pending package that waits for an acknowledgement before being processed.
   * @param {string} dependsOn - The message ID that this package depends on.
   * @param {ClientPackageDescription} [packageDesc] - The package description to send after acknowledgement.
   * @param {() => void} [callback] - The callback to execute after acknowledgement.
   * @returns {string | null} The UUID of the pending package, or null if no package description is provided.
   */
  createPending(
    dependsOn: string,
    packageDesc?: ClientPackageDescription | (() => void),
    callback?: () => void
  ): string | null {
    let pkg = undefined;
    let actualCallback: (() => void) | undefined = undefined;

    if (typeof packageDesc === 'function') {
      actualCallback = packageDesc;
    } else if (packageDesc) {
      pkg = PackageSender.wrapPackage(packageDesc);
      actualCallback = callback;
    }

    this.pendingPackages.push({
      pkg,
      dependsOn,
      callback: actualCallback,
    });

    return pkg ? pkg.uuid : null;
  }

  /**
   * Wraps a package description into an encoded format with a UUID.
   * @param {ClientPackageDescription} packageDesc - The package description to wrap.
   * @returns {{ encoded: Uint8Array<ArrayBufferLike>; uuid: string }} The encoded package and its UUID.
   * @private
   */
  private static wrapPackage(packageDesc: ClientPackageDescription): {
    encoded: Uint8Array<ArrayBufferLike>;
    uuid: string;
  } {
    const uuid = crypto.randomUUID();
    const pkg: ClientPackage = {
      id: uuid,
      ...packageDesc,
    };

    return {
      encoded: msgpack.encode(pkg),
      uuid: uuid,
    };
  }
}

const Sender = new PackageSender(URL);

export default Sender;
