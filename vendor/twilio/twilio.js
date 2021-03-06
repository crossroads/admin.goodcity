/*! twilio-client.js 1.7.7

The following license applies to all parts of this software except as
documented below.

    Copyright (C) 2015-2019 Twilio, inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

This software includes rtcpeerconnection-shim under the following (BSD 3-Clause) license.

    Copyright (c) 2017 Philipp Hancke. All rights reserved.

    Copyright (c) 2014, The WebRTC project authors. All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are
    met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in
        the documentation and/or other materials provided with the
        distribution.

      * Neither the name of Philipp Hancke nor the names of its contributors may
        be used to endorse or promote products derived from this software
        without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

This software includes backoff under the following (MIT) license.

    Copyright (C) 2012 Mathieu Turcotte

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    of the Software, and to permit persons to whom the Software is furnished to do
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

 */
(function(root) {
  var bundle = (function() {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function(r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function(require, module, exports) {
          "use strict";
          module.exports = WebSocket;
        },
        {}
      ],
      2: [
        function(require, module, exports) {
          "use strict";
          module.exports = { XMLHttpRequest: XMLHttpRequest };
        },
        {}
      ],
      3: [
        function(require, module, exports) {
          "use strict";
          var Device = require("./twilio/device").default;
          var _require = require("events"),
            EventEmitter = _require.EventEmitter;
          var instance = void 0;
          Object.defineProperty(Device, "instance", {
            get: function get() {
              return instance;
            },
            set: function set(_instance) {
              if (_instance === null) {
                instance = null;
              }
            }
          });
          Device.destroy = function destroySingleton() {
            instance.destroy();
            bindSingleton();
          };
          function bindSingleton() {
            instance = new Device();
            Object.getOwnPropertyNames(Device.prototype)
              .concat(Object.getOwnPropertyNames(EventEmitter.prototype))
              .filter(function(prop) {
                return typeof Device.prototype[prop] === "function";
              })
              .filter(function(prop) {
                return prop !== "destroy";
              })
              .forEach(function(prop) {
                Device[prop] = Device.prototype[prop].bind(instance);
              });
          }
          bindSingleton();
          Object.getOwnPropertyNames(instance)
            .filter(function(prop) {
              return typeof Device.prototype[prop] !== "function";
            })
            .forEach(function(prop) {
              Object.defineProperty(Device, prop, {
                get: function get() {
                  return instance[prop];
                },
                set: function set(_prop) {
                  instance[prop] = _prop;
                }
              });
            });
          exports.Device = Device;
          exports.PStream = require("./twilio/pstream").PStream;
          exports.Connection = require("./twilio/connection").Connection;
        },
        {
          "./twilio/connection": 5,
          "./twilio/device": 7,
          "./twilio/pstream": 12,
          events: 42
        }
      ],
      4: [
        function(require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function() {
              var extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function(d, b) {
                    d.__proto__ = b;
                  }) ||
                function(d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          var events_1 = require("events");
          var outputdevicecollection_1 = require("./outputdevicecollection");
          var defaultMediaDevices = require("./shims/mediadevices");
          var tslog_1 = require("./tslog");
          var util_1 = require("./util");
          var MediaDeviceInfoShim = require("./shims/mediadeviceinfo");
          var kindAliases = {
            audioinput: "Audio Input",
            audiooutput: "Audio Output"
          };
          var AudioHelper = (function(_super) {
            __extends(AudioHelper, _super);
            function AudioHelper(
              onActiveOutputsChanged,
              onActiveInputChanged,
              getUserMedia,
              options
            ) {
              var _this = _super.call(this) || this;
              _this.availableInputDevices = new Map();
              _this.availableOutputDevices = new Map();
              _this._audioConstraints = null;
              _this._inputDevice = null;
              _this._inputStream = null;
              _this._isPollingInputVolume = false;
              _this._unknownDeviceIndexes = { audioinput: {}, audiooutput: {} };
              _this._removeLostInput = function(lostDevice) {
                if (
                  !_this.inputDevice ||
                  _this.inputDevice.deviceId !== lostDevice.deviceId
                ) {
                  return false;
                }
                _this._replaceStream(null);
                _this._inputDevice = null;
                _this._maybeStopPollingVolume();
                var defaultDevice =
                  _this.availableInputDevices.get("default") ||
                  Array.from(_this.availableInputDevices.values())[0];
                if (defaultDevice) {
                  _this.setInputDevice(defaultDevice.deviceId);
                }
                return true;
              };
              _this._removeLostOutput = function(lostDevice) {
                var wasSpeakerLost = _this.speakerDevices.delete(lostDevice);
                var wasRingtoneLost = _this.ringtoneDevices.delete(lostDevice);
                return wasSpeakerLost || wasRingtoneLost;
              };
              _this._updateAvailableDevices = function() {
                if (!_this._mediaDevices) {
                  return Promise.reject("Enumeration not supported");
                }
                return _this._mediaDevices
                  .enumerateDevices()
                  .then(function(devices) {
                    _this._updateDevices(
                      devices.filter(function(d) {
                        return d.kind === "audiooutput";
                      }),
                      _this.availableOutputDevices,
                      _this._removeLostOutput
                    );
                    _this._updateDevices(
                      devices.filter(function(d) {
                        return d.kind === "audioinput";
                      }),
                      _this.availableInputDevices,
                      _this._removeLostInput
                    );
                    var defaultDevice =
                      _this.availableOutputDevices.get("default") ||
                      Array.from(_this.availableOutputDevices.values())[0];
                    [_this.speakerDevices, _this.ringtoneDevices].forEach(
                      function(outputDevices) {
                        if (
                          !outputDevices.get().size &&
                          _this.availableOutputDevices.size
                        ) {
                          outputDevices.set(defaultDevice.deviceId);
                        }
                      }
                    );
                  });
              };
              options = Object.assign(
                {
                  AudioContext:
                    typeof AudioContext !== "undefined" && AudioContext,
                  setSinkId:
                    typeof HTMLAudioElement !== "undefined" &&
                    HTMLAudioElement.prototype.setSinkId
                },
                options
              );
              _this._getUserMedia = getUserMedia;
              _this._log = new tslog_1.default(
                options.logLevel || tslog_1.LogLevel.Warn
              );
              _this._mediaDevices = options.mediaDevices || defaultMediaDevices;
              _this._onActiveInputChanged = onActiveInputChanged;
              var isAudioContextSupported = !!(
                options.AudioContext || options.audioContext
              );
              var isEnumerationSupported = !!(
                _this._mediaDevices && _this._mediaDevices.enumerateDevices
              );
              var isSetSinkSupported = typeof options.setSinkId === "function";
              _this.isOutputSelectionSupported =
                isEnumerationSupported && isSetSinkSupported;
              _this.isVolumeSupported = isAudioContextSupported;
              if (options.enabledSounds) {
                _this._addEnabledSounds(options.enabledSounds);
              }
              if (_this.isVolumeSupported) {
                _this._audioContext =
                  options.audioContext ||
                  (options.AudioContext && new options.AudioContext());
                if (_this._audioContext) {
                  _this._inputVolumeAnalyser = _this._audioContext.createAnalyser();
                  _this._inputVolumeAnalyser.fftSize = 32;
                  _this._inputVolumeAnalyser.smoothingTimeConstant = 0.3;
                }
              }
              _this.ringtoneDevices = new outputdevicecollection_1.default(
                "ringtone",
                _this.availableOutputDevices,
                onActiveOutputsChanged,
                _this.isOutputSelectionSupported
              );
              _this.speakerDevices = new outputdevicecollection_1.default(
                "speaker",
                _this.availableOutputDevices,
                onActiveOutputsChanged,
                _this.isOutputSelectionSupported
              );
              _this.addListener("newListener", function(eventName) {
                if (eventName === "inputVolume") {
                  _this._maybeStartPollingVolume();
                }
              });
              _this.addListener("removeListener", function(eventName) {
                if (eventName === "inputVolume") {
                  _this._maybeStopPollingVolume();
                }
              });
              _this.once("newListener", function() {
                if (!_this.isOutputSelectionSupported) {
                  _this._log.warn(
                    "Warning: This browser does not support audio output selection."
                  );
                }
                if (!_this.isVolumeSupported) {
                  _this._log.warn(
                    "Warning: This browser does not support Twilio's volume indicator feature."
                  );
                }
              });
              if (isEnumerationSupported) {
                _this._initializeEnumeration();
              }
              return _this;
            }
            Object.defineProperty(AudioHelper.prototype, "audioConstraints", {
              get: function() {
                return this._audioConstraints;
              },
              enumerable: true,
              configurable: true
            });
            Object.defineProperty(AudioHelper.prototype, "inputDevice", {
              get: function() {
                return this._inputDevice;
              },
              enumerable: true,
              configurable: true
            });
            Object.defineProperty(AudioHelper.prototype, "inputStream", {
              get: function() {
                return this._inputStream;
              },
              enumerable: true,
              configurable: true
            });
            AudioHelper.prototype._maybeStartPollingVolume = function() {
              var _this = this;
              if (!this.isVolumeSupported || !this._inputStream) {
                return;
              }
              this._updateVolumeSource();
              if (this._isPollingInputVolume || !this._inputVolumeAnalyser) {
                return;
              }
              var bufferLength = this._inputVolumeAnalyser.frequencyBinCount;
              var buffer = new Uint8Array(bufferLength);
              this._isPollingInputVolume = true;
              var emitVolume = function() {
                if (!_this._isPollingInputVolume) {
                  return;
                }
                if (_this._inputVolumeAnalyser) {
                  _this._inputVolumeAnalyser.getByteFrequencyData(buffer);
                  var inputVolume = util_1.average(buffer);
                  _this.emit("inputVolume", inputVolume / 255);
                }
                requestAnimationFrame(emitVolume);
              };
              requestAnimationFrame(emitVolume);
            };
            AudioHelper.prototype._maybeStopPollingVolume = function() {
              if (!this.isVolumeSupported) {
                return;
              }
              if (
                !this._isPollingInputVolume ||
                (this._inputStream && this.listenerCount("inputVolume"))
              ) {
                return;
              }
              if (this._inputVolumeSource) {
                this._inputVolumeSource.disconnect();
                delete this._inputVolumeSource;
              }
              this._isPollingInputVolume = false;
            };
            AudioHelper.prototype._unbind = function() {
              if (!this._mediaDevices) {
                throw new Error("Enumeration is not supported");
              }
              if (this._mediaDevices.removeEventListener) {
                this._mediaDevices.removeEventListener(
                  "devicechange",
                  this._updateAvailableDevices
                );
                this._mediaDevices.removeEventListener(
                  "deviceinfochange",
                  this._updateAvailableDevices
                );
              }
            };
            AudioHelper.prototype.setAudioConstraints = function(
              audioConstraints
            ) {
              this._audioConstraints = Object.assign({}, audioConstraints);
              delete this._audioConstraints.deviceId;
              return this.inputDevice
                ? this._setInputDevice(this.inputDevice.deviceId, true)
                : Promise.resolve();
            };
            AudioHelper.prototype.setInputDevice = function(deviceId) {
              return !util_1.isFirefox()
                ? this._setInputDevice(deviceId, false)
                : Promise.reject(
                    new Error(
                      "Firefox does not currently support opening multiple " +
                        "audio input tracks simultaneously, even across different tabs. As a result, " +
                        "Device.audio.setInputDevice is disabled on Firefox until support is added.\n" +
                        "Related BugZilla thread: https://bugzilla.mozilla.org/show_bug.cgi?id=1299324"
                    )
                  );
            };
            AudioHelper.prototype.unsetAudioConstraints = function() {
              this._audioConstraints = null;
              return this.inputDevice
                ? this._setInputDevice(this.inputDevice.deviceId, true)
                : Promise.resolve();
            };
            AudioHelper.prototype.unsetInputDevice = function() {
              var _this = this;
              if (!this.inputDevice) {
                return Promise.resolve();
              }
              return this._onActiveInputChanged(null).then(function() {
                _this._replaceStream(null);
                _this._inputDevice = null;
                _this._maybeStopPollingVolume();
              });
            };
            AudioHelper.prototype._addEnabledSounds = function(enabledSounds) {
              var _this = this;
              function setValue(key, value) {
                if (typeof value !== "undefined") {
                  enabledSounds[key] = value;
                }
                return enabledSounds[key];
              }
              Object.keys(enabledSounds).forEach(function(key) {
                _this[key] = setValue.bind(null, key);
              });
            };
            AudioHelper.prototype._getUnknownDeviceIndex = function(
              mediaDeviceInfo
            ) {
              var id = mediaDeviceInfo.deviceId;
              var kind = mediaDeviceInfo.kind;
              var index = this._unknownDeviceIndexes[kind][id];
              if (!index) {
                index =
                  Object.keys(this._unknownDeviceIndexes[kind]).length + 1;
                this._unknownDeviceIndexes[kind][id] = index;
              }
              return index;
            };
            AudioHelper.prototype._initializeEnumeration = function() {
              var _this = this;
              if (!this._mediaDevices) {
                throw new Error("Enumeration is not supported");
              }
              if (this._mediaDevices.addEventListener) {
                this._mediaDevices.addEventListener(
                  "devicechange",
                  this._updateAvailableDevices
                );
                this._mediaDevices.addEventListener(
                  "deviceinfochange",
                  this._updateAvailableDevices
                );
              }
              this._updateAvailableDevices().then(function() {
                if (!_this.isOutputSelectionSupported) {
                  return;
                }
                Promise.all([
                  _this.speakerDevices.set("default"),
                  _this.ringtoneDevices.set("default")
                ]).catch(function(reason) {
                  _this._log.warn(
                    "Warning: Unable to set audio output devices. " + reason
                  );
                });
              });
            };
            AudioHelper.prototype._replaceStream = function(stream) {
              if (this._inputStream) {
                this._inputStream.getTracks().forEach(function(track) {
                  track.stop();
                });
              }
              this._inputStream = stream;
            };
            AudioHelper.prototype._setInputDevice = function(
              deviceId,
              forceGetUserMedia
            ) {
              var _this = this;
              if (typeof deviceId !== "string") {
                return Promise.reject(
                  new Error("Must specify the device to set")
                );
              }
              var device = this.availableInputDevices.get(deviceId);
              if (!device) {
                return Promise.reject(
                  new Error("Device not found: " + deviceId)
                );
              }
              if (
                this._inputDevice &&
                this._inputDevice.deviceId === deviceId &&
                this._inputStream
              ) {
                if (!forceGetUserMedia) {
                  return Promise.resolve();
                }
                this._inputStream.getTracks().forEach(function(track) {
                  track.stop();
                });
              }
              var constraints = {
                audio: Object.assign(
                  { deviceId: { exact: deviceId } },
                  this.audioConstraints
                )
              };
              return this._getUserMedia(constraints).then(function(stream) {
                return _this._onActiveInputChanged(stream).then(function() {
                  _this._replaceStream(stream);
                  _this._inputDevice = device;
                  _this._maybeStartPollingVolume();
                });
              });
            };
            AudioHelper.prototype._updateDevices = function(
              updatedDevices,
              availableDevices,
              removeLostDevice
            ) {
              var _this = this;
              var updatedDeviceIds = updatedDevices.map(function(d) {
                return d.deviceId;
              });
              var knownDeviceIds = Array.from(availableDevices.values()).map(
                function(d) {
                  return d.deviceId;
                }
              );
              var lostActiveDevices = [];
              var lostDeviceIds = util_1.difference(
                knownDeviceIds,
                updatedDeviceIds
              );
              lostDeviceIds.forEach(function(lostDeviceId) {
                var lostDevice = availableDevices.get(lostDeviceId);
                if (lostDevice) {
                  availableDevices.delete(lostDeviceId);
                  if (removeLostDevice(lostDevice)) {
                    lostActiveDevices.push(lostDevice);
                  }
                }
              });
              var deviceChanged = false;
              updatedDevices.forEach(function(newDevice) {
                var existingDevice = availableDevices.get(newDevice.deviceId);
                var newMediaDeviceInfo = _this._wrapMediaDeviceInfo(newDevice);
                if (
                  !existingDevice ||
                  existingDevice.label !== newMediaDeviceInfo.label
                ) {
                  availableDevices.set(newDevice.deviceId, newMediaDeviceInfo);
                  deviceChanged = true;
                }
              });
              if (deviceChanged || lostDeviceIds.length) {
                if (
                  this.inputDevice !== null &&
                  this.inputDevice.deviceId === "default"
                ) {
                  this._log.warn(
                    "Calling getUserMedia after device change to ensure that the           tracks of the active device (default) have not gone stale."
                  );
                  this._setInputDevice(this.inputDevice.deviceId, true);
                }
                this.emit("deviceChange", lostActiveDevices);
              }
            };
            AudioHelper.prototype._updateVolumeSource = function() {
              if (
                !this._inputStream ||
                !this._audioContext ||
                !this._inputVolumeAnalyser
              ) {
                return;
              }
              if (this._inputVolumeSource) {
                this._inputVolumeSource.disconnect();
              }
              this._inputVolumeSource = this._audioContext.createMediaStreamSource(
                this._inputStream
              );
              this._inputVolumeSource.connect(this._inputVolumeAnalyser);
            };
            AudioHelper.prototype._wrapMediaDeviceInfo = function(
              mediaDeviceInfo
            ) {
              var options = {
                deviceId: mediaDeviceInfo.deviceId,
                groupId: mediaDeviceInfo.groupId,
                kind: mediaDeviceInfo.kind,
                label: mediaDeviceInfo.label
              };
              if (!options.label) {
                if (options.deviceId === "default") {
                  options.label = "Default";
                } else {
                  var index = this._getUnknownDeviceIndex(mediaDeviceInfo);
                  options.label =
                    "Unknown " + kindAliases[options.kind] + " Device " + index;
                }
              }
              return new MediaDeviceInfoShim(options);
            };
            return AudioHelper;
          })(events_1.EventEmitter);
          (function(AudioHelper) {})(AudioHelper || (AudioHelper = {}));
          exports.default = AudioHelper;
        },
        {
          "./outputdevicecollection": 11,
          "./shims/mediadeviceinfo": 25,
          "./shims/mediadevices": 26,
          "./tslog": 28,
          "./util": 29,
          events: 42
        }
      ],
      5: [
        function(require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function() {
              var extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function(d, b) {
                    d.__proto__ = b;
                  }) ||
                function(d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            Object.assign ||
            function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
              }
              return t;
            };
          Object.defineProperty(exports, "__esModule", { value: true });
          var events_1 = require("events");
          var device_1 = require("./device");
          var monitor_1 = require("./rtc/monitor");
          var tslog_1 = require("./tslog");
          var util_1 = require("./util");
          var C = require("./constants");
          var PeerConnection = require("./rtc").PeerConnection;
          var DTMF_INTER_TONE_GAP = 70;
          var DTMF_PAUSE_DURATION = 500;
          var DTMF_TONE_DURATION = 160;
          var ICE_RESTART_INTERVAL = 3e3;
          var METRICS_BATCH_SIZE = 10;
          var METRICS_DELAY = 5e3;
          var WARNING_NAMES = {
            audioInputLevel: "audio-input-level",
            audioOutputLevel: "audio-output-level",
            bytesReceived: "bytes-received",
            bytesSent: "bytes-sent",
            jitter: "jitter",
            mos: "mos",
            packetsLostFraction: "packet-loss",
            rtt: "rtt"
          };
          var WARNING_PREFIXES = {
            max: "high-",
            maxDuration: "constant-",
            min: "low-"
          };
          var hasBeenWarnedHandlers = false;
          var Connection = (function(_super) {
            __extends(Connection, _super);
            function Connection(config, options) {
              var _this = _super.call(this) || this;
              _this.parameters = {};
              _this._inputVolumeStreak = 0;
              _this._internalInputVolumes = [];
              _this._internalOutputVolumes = [];
              _this._isAnswered = false;
              _this._latestInputVolume = 0;
              _this._latestOutputVolume = 0;
              _this._log = new tslog_1.default(tslog_1.LogLevel.Off);
              _this._metricsSamples = [];
              _this._outputVolumeStreak = 0;
              _this._soundcache = new Map();
              _this._status = Connection.State.Pending;
              _this.options = {
                debug: false,
                enableRingingState: false,
                mediaStreamFactory: PeerConnection,
                offerSdp: null,
                shouldPlayDisconnect: function() {
                  return true;
                }
              };
              _this.sendHangup = true;
              _this.toString = function() {
                return "[Twilio.Connection instance]";
              };
              _this._emitWarning = function(
                groupPrefix,
                warningName,
                threshold,
                value,
                wasCleared
              ) {
                var groupSuffix = wasCleared ? "-cleared" : "-raised";
                var groupName = groupPrefix + "warning" + groupSuffix;
                if (
                  warningName === "constant-audio-input-level" &&
                  _this.isMuted()
                ) {
                  return;
                }
                var level = wasCleared ? "info" : "warning";
                if (warningName === "constant-audio-output-level") {
                  level = "info";
                }
                var payloadData = { threshold: threshold };
                if (value) {
                  if (value instanceof Array) {
                    payloadData.values = value.map(function(val) {
                      if (typeof val === "number") {
                        return Math.round(val * 100) / 100;
                      }
                      return value;
                    });
                  } else {
                    payloadData.value = value;
                  }
                }
                _this._publisher.post(
                  level,
                  groupName,
                  warningName,
                  { data: payloadData },
                  _this
                );
                if (warningName !== "constant-audio-output-level") {
                  var emitName = wasCleared ? "warning-cleared" : "warning";
                  _this.emit(emitName, warningName);
                }
              };
              _this._onAnswer = function(payload) {
                if (_this._isAnswered) {
                  return;
                }
                _this._setCallSid(payload);
                _this._isAnswered = true;
                _this._maybeTransitionToOpen();
              };
              _this._onCancel = function(payload) {
                var callsid = payload.callsid;
                if (_this.parameters.CallSid === callsid) {
                  _this._status = Connection.State.Closed;
                  _this.emit("cancel");
                  _this.pstream.removeListener("cancel", _this._onCancel);
                }
              };
              _this._onHangup = function(payload) {
                if (
                  payload.callsid &&
                  (_this.parameters.CallSid || _this.outboundConnectionId)
                ) {
                  if (
                    payload.callsid !== _this.parameters.CallSid &&
                    payload.callsid !== _this.outboundConnectionId
                  ) {
                    return;
                  }
                } else if (payload.callsid) {
                  return;
                }
                _this._log.info("Received HANGUP from gateway");
                if (payload.error) {
                  var error = {
                    code: payload.error.code || 31e3,
                    connection: _this,
                    message:
                      payload.error.message ||
                      "Error sent from gateway in HANGUP"
                  };
                  _this._log.error(
                    "Received an error from the gateway:",
                    error
                  );
                  _this.emit("error", error);
                }
                _this.sendHangup = false;
                _this._publisher.info(
                  "connection",
                  "disconnected-by-remote",
                  null,
                  _this
                );
                _this._disconnect(null, true);
                _this._cleanupEventListeners();
              };
              _this._onRinging = function(payload) {
                _this._setCallSid(payload);
                if (
                  _this._status !== Connection.State.Connecting &&
                  _this._status !== Connection.State.Ringing
                ) {
                  return;
                }
                var hasEarlyMedia = !!payload.sdp;
                if (_this.options.enableRingingState) {
                  _this._status = Connection.State.Ringing;
                  _this._publisher.info(
                    "connection",
                    "outgoing-ringing",
                    { hasEarlyMedia: hasEarlyMedia },
                    _this
                  );
                  _this.emit("ringing", hasEarlyMedia);
                } else if (hasEarlyMedia) {
                  _this._onAnswer(payload);
                }
              };
              _this._onRTCSample = function(sample) {
                var callMetrics = __assign({}, sample, {
                  audioInputLevel: Math.round(
                    util_1.average(_this._internalInputVolumes)
                  ),
                  audioOutputLevel: Math.round(
                    util_1.average(_this._internalOutputVolumes)
                  ),
                  inputVolume: _this._latestInputVolume,
                  outputVolume: _this._latestOutputVolume
                });
                _this._internalInputVolumes.splice(0);
                _this._internalOutputVolumes.splice(0);
                _this._codec = callMetrics.codecName;
                _this._metricsSamples.push(callMetrics);
                if (_this._metricsSamples.length >= METRICS_BATCH_SIZE) {
                  _this._publishMetrics();
                }
                _this.emit("sample", sample);
              };
              _this._reemitWarning = function(warningData, wasCleared) {
                var groupPrefix = /^audio/.test(warningData.name)
                  ? "audio-level-"
                  : "network-quality-";
                var warningPrefix =
                  WARNING_PREFIXES[warningData.threshold.name];
                var warningName =
                  warningPrefix + WARNING_NAMES[warningData.name];
                _this._emitWarning(
                  groupPrefix,
                  warningName,
                  warningData.threshold.value,
                  warningData.values || warningData.value,
                  wasCleared
                );
              };
              _this._reemitWarningCleared = function(warningData) {
                _this._reemitWarning(warningData, true);
              };
              _this._isUnifiedPlanDefault = config.isUnifiedPlanDefault;
              _this._soundcache = config.soundcache;
              _this.message = (options && options.twimlParams) || {};
              _this.customParameters = new Map(
                Object.entries(_this.message).map(function(_a) {
                  var key = _a[0],
                    val = _a[1];
                  return [key, String(val)];
                })
              );
              Object.assign(_this.options, options);
              if (_this.options.callParameters) {
                _this.parameters = _this.options.callParameters;
              }
              _this._direction = _this.parameters.CallSid
                ? Connection.CallDirection.Incoming
                : Connection.CallDirection.Outgoing;
              _this._log.setLogLevel(
                _this.options.debug
                  ? tslog_1.LogLevel.Debug
                  : _this.options.warnings
                  ? tslog_1.LogLevel.Warn
                  : tslog_1.LogLevel.Off
              );
              var publisher = (_this._publisher = config.publisher);
              if (_this._direction === Connection.CallDirection.Incoming) {
                publisher.info("connection", "incoming", null, _this);
              }
              var monitor = (_this._monitor = new (_this.options.RTCMonitor ||
                monitor_1.default)());
              monitor.on("sample", _this._onRTCSample);
              monitor.disableWarnings();
              setTimeout(function() {
                return monitor.enableWarnings();
              }, METRICS_DELAY);
              monitor.on("warning", function(data, wasCleared) {
                var samples = data.samples,
                  name = data.name;
                if (
                  _this.options.enableIceRestart &&
                  (name === "bytesSent" || name === "bytesReceived")
                ) {
                  if (
                    samples &&
                    samples.every(function(sample) {
                      return sample.totals[name] === 0;
                    })
                  ) {
                    return;
                  }
                  _this._log.warn("ICE Connection disconnected.");
                  _this._stopIceRestarts();
                  _this._iceRestartIntervalId = setInterval(function() {
                    _this.mediaStream.iceRestart().catch(function(canRetry) {
                      if (!canRetry) {
                        _this._log.info(
                          "Received hangup from the server. Stopping attempts to restart ICE."
                        );
                        _this._stopIceRestarts();
                      }
                    });
                  }, ICE_RESTART_INTERVAL);
                }
                _this._reemitWarning(data, wasCleared);
              });
              monitor.on("warning-cleared", function(data) {
                var samples = data.samples,
                  name = data.name;
                if (name === "bytesSent" || name === "bytesReceived") {
                  if (
                    samples &&
                    samples.every(function(sample) {
                      return sample.totals[name] === 0;
                    })
                  ) {
                    return;
                  }
                  _this._log.info("ICE Connection reestablished.");
                  _this._stopIceRestarts();
                }
                _this._reemitWarningCleared(data);
              });
              _this.mediaStream = new (_this.options.MediaStream ||
                _this.options.mediaStreamFactory)(
                config.audioHelper,
                config.pstream,
                config.getUserMedia,
                {
                  codecPreferences: _this.options.codecPreferences,
                  debug: _this.options.debug,
                  dscp: _this.options.dscp,
                  enableIceRestart: _this.options.enableIceRestart,
                  isUnifiedPlan: _this._isUnifiedPlanDefault,
                  warnings: _this.options.warnings
                }
              );
              _this.on("volume", function(inputVolume, outputVolume) {
                _this._inputVolumeStreak = _this._checkVolume(
                  inputVolume,
                  _this._inputVolumeStreak,
                  _this._latestInputVolume,
                  "input"
                );
                _this._outputVolumeStreak = _this._checkVolume(
                  outputVolume,
                  _this._outputVolumeStreak,
                  _this._latestOutputVolume,
                  "output"
                );
                _this._latestInputVolume = inputVolume;
                _this._latestOutputVolume = outputVolume;
              });
              _this.mediaStream.onvolume = function(
                inputVolume,
                outputVolume,
                internalInputVolume,
                internalOutputVolume
              ) {
                _this._internalInputVolumes.push(
                  (internalInputVolume / 255) * 32767
                );
                _this._internalOutputVolumes.push(
                  (internalOutputVolume / 255) * 32767
                );
                _this.emit("volume", inputVolume, outputVolume);
              };
              _this.mediaStream.oniceconnectionstatechange = function(state) {
                var level = state === "failed" ? "error" : "debug";
                _this._publisher.post(
                  level,
                  "ice-connection-state",
                  state,
                  null,
                  _this
                );
              };
              _this.mediaStream.onicegatheringstatechange = function(state) {
                _this._publisher.debug(
                  "ice-gathering-state",
                  state,
                  null,
                  _this
                );
              };
              _this.mediaStream.onsignalingstatechange = function(state) {
                _this._publisher.debug("signaling-state", state, null, _this);
              };
              _this.mediaStream.ondisconnect = function(msg) {
                _this._log.info(msg);
                _this._publisher.warn(
                  "network-quality-warning-raised",
                  "ice-connectivity-lost",
                  { message: msg },
                  _this
                );
                _this.emit("warning", "ice-connectivity-lost");
              };
              _this.mediaStream.onreconnect = function(msg) {
                _this._log.info(msg);
                _this._publisher.info(
                  "network-quality-warning-cleared",
                  "ice-connectivity-lost",
                  { message: msg },
                  _this
                );
                _this.emit("warning-cleared", "ice-connectivity-lost");
              };
              _this.mediaStream.onerror = function(e) {
                if (e.disconnect === true) {
                  _this._disconnect(e.info && e.info.message);
                }
                var error = {
                  code: e.info.code,
                  connection: _this,
                  info: e.info,
                  message: e.info.message || "Error with mediastream"
                };
                _this._log.error("Received an error from MediaStream:", e);
                _this.emit("error", error);
              };
              _this.mediaStream.onopen = function() {
                if (_this._status === Connection.State.Open) {
                  return;
                } else if (
                  _this._status === Connection.State.Ringing ||
                  _this._status === Connection.State.Connecting
                ) {
                  _this.mute(false);
                  _this._maybeTransitionToOpen();
                } else {
                  _this.mediaStream.close();
                }
              };
              _this.mediaStream.onclose = function() {
                _this._status = Connection.State.Closed;
                if (
                  _this.options.shouldPlayDisconnect &&
                  _this.options.shouldPlayDisconnect()
                ) {
                  _this._soundcache
                    .get(device_1.default.SoundName.Disconnect)
                    .play();
                }
                monitor.disable();
                _this._stopIceRestarts();
                _this._publishMetrics();
                _this.emit("disconnect", _this);
              };
              _this.outboundConnectionId = generateTempCallSid();
              _this.pstream = config.pstream;
              _this.pstream.on("cancel", _this._onCancel);
              _this.pstream.on("ringing", _this._onRinging);
              if (_this.options.enableIceRestart) {
                _this.pstream.on(
                  "transportClosed",
                  _this._disconnect.bind(_this)
                );
              }
              _this.on("error", function(error) {
                _this._publisher.error(
                  "connection",
                  "error",
                  { code: error.code, message: error.message },
                  _this
                );
                if (_this.pstream && _this.pstream.status === "disconnected") {
                  _this._cleanupEventListeners();
                }
              });
              _this.on("disconnect", function() {
                _this._cleanupEventListeners();
              });
              return _this;
            }
            Object.defineProperty(Connection.prototype, "direction", {
              get: function() {
                return this._direction;
              },
              enumerable: true,
              configurable: true
            });
            Object.defineProperty(Connection.prototype, "codec", {
              get: function() {
                return this._codec;
              },
              enumerable: true,
              configurable: true
            });
            Connection.prototype._getRealCallSid = function() {
              this._log.warn(
                "_getRealCallSid is deprecated and will be removed in 2.0."
              );
              return /^TJ/.test(this.parameters.CallSid)
                ? null
                : this.parameters.CallSid;
            };
            Connection.prototype._getTempCallSid = function() {
              this._log.warn(
                "_getTempCallSid is deprecated and will be removed in 2.0.                     Please use outboundConnectionId instead."
              );
              return this.outboundConnectionId;
            };
            Connection.prototype._setInputTracksFromStream = function(stream) {
              return this.mediaStream.setInputTracksFromStream(stream);
            };
            Connection.prototype._setSinkIds = function(sinkIds) {
              return this.mediaStream._setSinkIds(sinkIds);
            };
            Connection.prototype.accept = function(handlerOrConstraints) {
              var _this = this;
              if (typeof handlerOrConstraints === "function") {
                this._addHandler("accept", handlerOrConstraints);
                return;
              }
              if (this._status !== Connection.State.Pending) {
                return;
              }
              var audioConstraints =
                handlerOrConstraints || this.options.audioConstraints;
              this._status = Connection.State.Connecting;
              var connect = function() {
                if (_this._status !== Connection.State.Connecting) {
                  _this._cleanupEventListeners();
                  _this.mediaStream.close();
                  return;
                }
                var onLocalAnswer = function(pc) {
                  _this._publisher.info(
                    "connection",
                    "accepted-by-local",
                    null,
                    _this
                  );
                  _this._monitor.enable(pc);
                };
                var onRemoteAnswer = function(pc) {
                  _this._publisher.info(
                    "connection",
                    "accepted-by-remote",
                    null,
                    _this
                  );
                  _this._monitor.enable(pc);
                };
                var sinkIds =
                  typeof _this.options.getSinkIds === "function" &&
                  _this.options.getSinkIds();
                if (Array.isArray(sinkIds)) {
                  _this.mediaStream._setSinkIds(sinkIds).catch(function() {});
                }
                _this.pstream.addListener("hangup", _this._onHangup);
                if (_this._direction === Connection.CallDirection.Incoming) {
                  _this._isAnswered = true;
                  _this.mediaStream.answerIncomingCall(
                    _this.parameters.CallSid,
                    _this.options.offerSdp,
                    _this.options.rtcConstraints,
                    _this.options.rtcConfiguration,
                    onLocalAnswer
                  );
                } else {
                  var params = Array.from(_this.customParameters.entries())
                    .map(function(pair) {
                      return (
                        encodeURIComponent(pair[0]) +
                        "=" +
                        encodeURIComponent(pair[1])
                      );
                    })
                    .join("&");
                  _this.pstream.once("answer", _this._onAnswer.bind(_this));
                  _this.mediaStream.makeOutgoingCall(
                    _this.pstream.token,
                    params,
                    _this.outboundConnectionId,
                    _this.options.rtcConstraints,
                    _this.options.rtcConfiguration,
                    onRemoteAnswer
                  );
                }
              };
              if (this.options.beforeAccept) {
                this.options.beforeAccept(this);
              }
              var inputStream =
                typeof this.options.getInputStream === "function" &&
                this.options.getInputStream();
              var promise = inputStream
                ? this.mediaStream.setInputTracksFromStream(inputStream)
                : this.mediaStream.openWithConstraints(audioConstraints);
              promise.then(
                function() {
                  _this._publisher.info(
                    "get-user-media",
                    "succeeded",
                    { data: { audioConstraints: audioConstraints } },
                    _this
                  );
                  connect();
                },
                function(error) {
                  var message;
                  var code;
                  if (
                    (error.code && error.code === 31208) ||
                    (error.name && error.name === "PermissionDeniedError")
                  ) {
                    code = 31208;
                    message =
                      "User denied access to microphone, or the web browser did not allow microphone " +
                      "access at this address.";
                    _this._publisher.error(
                      "get-user-media",
                      "denied",
                      {
                        data: {
                          audioConstraints: audioConstraints,
                          error: error
                        }
                      },
                      _this
                    );
                  } else {
                    code = 31201;
                    message =
                      "Error occurred while accessing microphone: " +
                      error.name +
                      (error.message ? " (" + error.message + ")" : "");
                    _this._publisher.error(
                      "get-user-media",
                      "failed",
                      {
                        data: {
                          audioConstraints: audioConstraints,
                          error: error
                        }
                      },
                      _this
                    );
                  }
                  _this._disconnect();
                  _this.emit("error", { message: message, code: code });
                }
              );
            };
            Connection.prototype.cancel = function(handler) {
              this._log.warn(
                ".cancel() is deprecated. Please use .ignore() instead."
              );
              if (handler) {
                this.ignore(handler);
              } else {
                this.ignore();
              }
            };
            Connection.prototype.disconnect = function(handler) {
              if (typeof handler === "function") {
                this._addHandler("disconnect", handler);
                return;
              }
              this._disconnect();
            };
            Connection.prototype.error = function(handler) {
              if (typeof handler === "function") {
                this._addHandler("error", handler);
              }
            };
            Connection.prototype.getLocalStream = function() {
              return this.mediaStream && this.mediaStream.stream;
            };
            Connection.prototype.getRemoteStream = function() {
              return this.mediaStream && this.mediaStream._remoteStream;
            };
            Connection.prototype.ignore = function(handler) {
              if (typeof handler === "function") {
                this._addHandler("cancel", handler);
                return;
              }
              if (this._status !== Connection.State.Pending) {
                return;
              }
              this._status = Connection.State.Closed;
              this.emit("cancel");
              this.mediaStream.ignore(this.parameters.CallSid);
              this._publisher.info(
                "connection",
                "ignored-by-local",
                null,
                this
              );
            };
            Connection.prototype.isMuted = function() {
              return this.mediaStream.isMuted;
            };
            Connection.prototype.mute = function(shouldMute) {
              if (shouldMute === void 0) {
                shouldMute = true;
              }
              if (typeof shouldMute === "function") {
                this._addHandler("mute", shouldMute);
                return;
              }
              var wasMuted = this.mediaStream.isMuted;
              this.mediaStream.mute(shouldMute);
              var isMuted = this.mediaStream.isMuted;
              if (wasMuted !== isMuted) {
                this._publisher.info(
                  "connection",
                  isMuted ? "muted" : "unmuted",
                  null,
                  this
                );
                this.emit("mute", isMuted, this);
              }
            };
            Connection.prototype.postFeedback = function(score, issue) {
              if (typeof score === "undefined" || score === null) {
                return this._postFeedbackDeclined();
              }
              if (!Object.values(Connection.FeedbackScore).includes(score)) {
                throw new Error(
                  "Feedback score must be one of: " +
                    Object.values(Connection.FeedbackScore)
                );
              }
              if (
                typeof issue !== "undefined" &&
                issue !== null &&
                !Object.values(Connection.FeedbackIssue).includes(issue)
              ) {
                throw new Error(
                  "Feedback issue must be one of: " +
                    Object.values(Connection.FeedbackIssue)
                );
              }
              return this._publisher.info(
                "feedback",
                "received",
                { issue_name: issue, quality_score: score },
                this,
                true
              );
            };
            Connection.prototype.reject = function(handler) {
              if (typeof handler === "function") {
                this._addHandler("reject", handler);
                return;
              }
              if (this._status !== Connection.State.Pending) {
                return;
              }
              var payload = { callsid: this.parameters.CallSid };
              this.pstream.publish("reject", payload);
              this.emit("reject");
              this.mediaStream.reject(this.parameters.CallSid);
              this._publisher.info(
                "connection",
                "rejected-by-local",
                null,
                this
              );
            };
            Connection.prototype.sendDigits = function(digits) {
              if (digits.match(/[^0-9*#w]/)) {
                throw new util_1.Exception(
                  "Illegal character passed into sendDigits"
                );
              }
              var sequence = [];
              digits.split("").forEach(function(digit) {
                var dtmf = digit !== "w" ? "dtmf" + digit : "";
                if (dtmf === "dtmf*") {
                  dtmf = "dtmfs";
                }
                if (dtmf === "dtmf#") {
                  dtmf = "dtmfh";
                }
                sequence.push(dtmf);
              });
              (function playNextDigit(soundCache, dialtonePlayer) {
                var digit = sequence.shift();
                if (digit) {
                  if (dialtonePlayer) {
                    dialtonePlayer.play(digit);
                  } else {
                    soundCache.get(digit).play();
                  }
                }
                if (sequence.length) {
                  setTimeout(playNextDigit.bind(null, soundCache), 200);
                }
              })(this._soundcache, this.options.dialtonePlayer);
              var dtmfSender = this.mediaStream.getOrCreateDTMFSender();
              function insertDTMF(dtmfs) {
                if (!dtmfs.length) {
                  return;
                }
                var dtmf = dtmfs.shift();
                if (dtmf && dtmf.length) {
                  dtmfSender.insertDTMF(
                    dtmf,
                    DTMF_TONE_DURATION,
                    DTMF_INTER_TONE_GAP
                  );
                }
                setTimeout(insertDTMF.bind(null, dtmfs), DTMF_PAUSE_DURATION);
              }
              if (dtmfSender) {
                if (
                  !("canInsertDTMF" in dtmfSender) ||
                  dtmfSender.canInsertDTMF
                ) {
                  this._log.info("Sending digits using RTCDTMFSender");
                  insertDTMF(digits.split("w"));
                  return;
                }
                this._log.info("RTCDTMFSender cannot insert DTMF");
              }
              this._log.info("Sending digits over PStream");
              if (
                this.pstream !== null &&
                this.pstream.status !== "disconnected"
              ) {
                this.pstream.publish("dtmf", {
                  callsid: this.parameters.CallSid,
                  dtmf: digits
                });
              } else {
                var error = {
                  code: 31e3,
                  connection: this,
                  message:
                    "Could not send DTMF: Signaling channel is disconnected"
                };
                this.emit("error", error);
              }
            };
            Connection.prototype.status = function() {
              return this._status;
            };
            Connection.prototype.unmute = function() {
              this._log.warn(
                ".unmute() is deprecated. Please use .mute(false) to unmute a call instead."
              );
              this.mute(false);
            };
            Connection.prototype.volume = function(handler) {
              if (
                !window ||
                (!window.AudioContext && !window.webkitAudioContext)
              ) {
                this._log.warn(
                  "This browser does not support Connection.volume"
                );
              }
              this._addHandler("volume", handler);
            };
            Connection.prototype._addHandler = function(eventName, handler) {
              if (!hasBeenWarnedHandlers) {
                this._log.warn(
                  "Connection callback handlers (accept, cancel, disconnect, error, ignore, mute, reject,\n        volume) have been deprecated and will be removed in the next breaking release. Instead, the EventEmitter         interface can be used to set event listeners. Example: connection.on('" +
                    eventName +
                    "', handler)"
                );
                hasBeenWarnedHandlers = true;
              }
              this.addListener(eventName, handler);
              return this;
            };
            Connection.prototype._checkVolume = function(
              currentVolume,
              currentStreak,
              lastValue,
              direction
            ) {
              var wasWarningRaised = currentStreak >= 10;
              var newStreak = 0;
              if (lastValue === currentVolume) {
                newStreak = currentStreak;
              }
              if (newStreak >= 10) {
                this._emitWarning(
                  "audio-level-",
                  "constant-audio-" + direction + "-level",
                  10,
                  newStreak,
                  false
                );
              } else if (wasWarningRaised) {
                this._emitWarning(
                  "audio-level-",
                  "constant-audio-" + direction + "-level",
                  10,
                  newStreak,
                  true
                );
              }
              return newStreak;
            };
            Connection.prototype._cleanupEventListeners = function() {
              var _this = this;
              var cleanup = function() {
                if (!_this.pstream) {
                  return;
                }
                _this.pstream.removeListener("answer", _this._onAnswer);
                _this.pstream.removeListener("cancel", _this._onCancel);
                _this.pstream.removeListener("hangup", _this._onHangup);
                _this.pstream.removeListener("ringing", _this._onRinging);
              };
              cleanup();
              setTimeout(cleanup, 0);
            };
            Connection.prototype._createMetricPayload = function() {
              var payload = {
                call_sid: this.parameters.CallSid,
                dscp: !!this.options.dscp,
                sdk_version: C.RELEASE_VERSION,
                selected_region: this.options.selectedRegion
              };
              if (this.options.gateway) {
                payload.gateway = this.options.gateway;
              }
              if (this.options.region) {
                payload.region = this.options.region;
              }
              payload.direction = this._direction;
              return payload;
            };
            Connection.prototype._disconnect = function(message, wasRemote) {
              message = typeof message === "string" ? message : null;
              this._stopIceRestarts();
              if (
                this._status !== Connection.State.Open &&
                this._status !== Connection.State.Connecting &&
                this._status !== Connection.State.Ringing
              ) {
                return;
              }
              this._log.info("Disconnecting...");
              if (
                this.pstream !== null &&
                this.pstream.status !== "disconnected" &&
                this.sendHangup
              ) {
                var callsid =
                  this.parameters.CallSid || this.outboundConnectionId;
                if (callsid) {
                  var payload = { callsid: callsid };
                  if (message) {
                    payload.message = message;
                  }
                  this.pstream.publish("hangup", payload);
                }
              }
              this._cleanupEventListeners();
              this.mediaStream.close();
              if (!wasRemote) {
                this._publisher.info(
                  "connection",
                  "disconnected-by-local",
                  null,
                  this
                );
              }
            };
            Connection.prototype._maybeTransitionToOpen = function() {
              if (
                this.mediaStream &&
                this.mediaStream.status === "open" &&
                this._isAnswered
              ) {
                this._status = Connection.State.Open;
                this.emit("accept", this);
              }
            };
            Connection.prototype._postFeedbackDeclined = function() {
              return this._publisher.info(
                "feedback",
                "received-none",
                null,
                this,
                true
              );
            };
            Connection.prototype._publishMetrics = function() {
              var _this = this;
              if (this._metricsSamples.length === 0) {
                return;
              }
              this._publisher
                .postMetrics(
                  "quality-metrics-samples",
                  "metrics-sample",
                  this._metricsSamples.splice(0),
                  this._createMetricPayload(),
                  this
                )
                .catch(function(e) {
                  _this._log.warn(
                    "Unable to post metrics to Insights. Received error:",
                    e
                  );
                });
            };
            Connection.prototype._setCallSid = function(payload) {
              var callSid = payload.callsid;
              if (!callSid) {
                return;
              }
              this.parameters.CallSid = callSid;
              this.mediaStream.callSid = callSid;
            };
            Connection.prototype._stopIceRestarts = function() {
              clearInterval(this._iceRestartIntervalId);
            };
            Connection.toString = function() {
              return "[Twilio.Connection class]";
            };
            return Connection;
          })(events_1.EventEmitter);
          (function(Connection) {
            var State;
            (function(State) {
              State["Closed"] = "closed";
              State["Connecting"] = "connecting";
              State["Open"] = "open";
              State["Pending"] = "pending";
              State["Ringing"] = "ringing";
            })((State = Connection.State || (Connection.State = {})));
            var FeedbackIssue;
            (function(FeedbackIssue) {
              FeedbackIssue["AudioLatency"] = "audio-latency";
              FeedbackIssue["ChoppyAudio"] = "choppy-audio";
              FeedbackIssue["DroppedCall"] = "dropped-call";
              FeedbackIssue["Echo"] = "echo";
              FeedbackIssue["NoisyCall"] = "noisy-call";
              FeedbackIssue["OneWayAudio"] = "one-way-audio";
            })(
              (FeedbackIssue =
                Connection.FeedbackIssue || (Connection.FeedbackIssue = {}))
            );
            var FeedbackScore;
            (function(FeedbackScore) {
              FeedbackScore[(FeedbackScore["One"] = 1)] = "One";
              FeedbackScore[(FeedbackScore["Two"] = 2)] = "Two";
              FeedbackScore[(FeedbackScore["Three"] = 3)] = "Three";
              FeedbackScore[(FeedbackScore["Four"] = 4)] = "Four";
              FeedbackScore[(FeedbackScore["Five"] = 5)] = "Five";
            })(
              (FeedbackScore =
                Connection.FeedbackScore || (Connection.FeedbackScore = {}))
            );
            var CallDirection;
            (function(CallDirection) {
              CallDirection["Incoming"] = "INCOMING";
              CallDirection["Outgoing"] = "OUTGOING";
            })(
              (CallDirection =
                Connection.CallDirection || (Connection.CallDirection = {}))
            );
            var Codec;
            (function(Codec) {
              Codec["Opus"] = "opus";
              Codec["PCMU"] = "pcmu";
            })((Codec = Connection.Codec || (Connection.Codec = {})));
          })(Connection || (Connection = {}));
          function generateTempCallSid() {
            return "TJSxxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
              /[xy]/g,
              function(c) {
                var r = (Math.random() * 16) | 0;
                var v = c === "x" ? r : (r & 3) | 8;
                return v.toString(16);
              }
            );
          }
          exports.default = Connection;
        },
        {
          "./constants": 6,
          "./device": 7,
          "./rtc": 16,
          "./rtc/monitor": 18,
          "./tslog": 28,
          "./util": 29,
          events: 42
        }
      ],
      6: [
        function(require, module, exports) {
          var RELEASE_VERSION = "1.7.7";
          module.exports.SOUNDS_BASE_URL =
            "https://media.twiliocdn.com/sdk/js/client/sounds/releases/1.0.0";
          module.exports.RELEASE_VERSION = RELEASE_VERSION;
        },
        {}
      ],
      7: [
        function(require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function() {
              var extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function(d, b) {
                    d.__proto__ = b;
                  }) ||
                function(d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          var events_1 = require("events");
          var audiohelper_1 = require("./audiohelper");
          var connection_1 = require("./connection");
          var dialtonePlayer_1 = require("./dialtonePlayer");
          var pstream_1 = require("./pstream");
          var regions_1 = require("./regions");
          var tslog_1 = require("./tslog");
          var util_1 = require("./util");
          var C = require("./constants");
          var Publisher = require("./eventpublisher");
          var rtc = require("./rtc");
          var getUserMedia = require("./rtc/getusermedia");
          var Sound = require("./sound");
          var isUnifiedPlanDefault = require("./util").isUnifiedPlanDefault;
          var networkInformation =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
          var REGISTRATION_INTERVAL = 3e4;
          var RINGTONE_PLAY_TIMEOUT = 2e3;
          var hasBeenWarnedHandlers = false;
          var hasBeenWarnedSounds = false;
          var Device = (function(_super) {
            __extends(Device, _super);
            function Device(token, options) {
              var _this = _super.call(this) || this;
              _this.audio = null;
              _this.connections = [];
              _this.isInitialized = false;
              _this.sounds = {};
              _this.token = null;
              _this._activeConnection = null;
              _this._connectionInputStream = null;
              _this._connectionSinkIds = ["default"];
              _this._enabledSounds = ((_a = {}),
              (_a[Device.SoundName.Disconnect] = true),
              (_a[Device.SoundName.Incoming] = true),
              (_a[Device.SoundName.Outgoing] = true),
              _a);
              _this._log = new tslog_1.default(tslog_1.LogLevel.Off);
              _this._logLevel = tslog_1.LogLevel.Off;
              _this._publisher = null;
              _this._region = null;
              _this._status = Device.Status.Offline;
              _this.mediaPresence = { audio: true };
              _this.options = {
                allowIncomingWhileBusy: false,
                audioConstraints: true,
                closeProtection: false,
                codecPreferences: [
                  connection_1.default.Codec.PCMU,
                  connection_1.default.Codec.Opus
                ],
                connectionFactory: connection_1.default,
                debug: false,
                dscp: true,
                enableIceRestart: false,
                eventgw: "eventgw.twilio.com",
                iceServers: [],
                noRegister: false,
                pStreamFactory: pstream_1.PStream,
                region: regions_1.Region.Gll,
                rtcConstraints: {},
                soundFactory: Sound,
                sounds: {},
                warnings: true
              };
              _this.regTimer = null;
              _this.soundcache = new Map();
              _this.stream = null;
              _this._confirmClose = function(event) {
                if (!_this._activeConnection) {
                  return "";
                }
                var closeProtection = _this.options.closeProtection || false;
                var confirmationMsg =
                  typeof closeProtection !== "string"
                    ? "A call is currently in-progress. Leaving or reloading this page will end the call."
                    : closeProtection;
                (event || window.event).returnValue = confirmationMsg;
                return confirmationMsg;
              };
              _this._createDefaultPayload = function(connection) {
                var payload = {
                  dscp: !!_this.options.dscp,
                  platform: rtc.getMediaEngine(),
                  sdk_version: C.RELEASE_VERSION,
                  selected_region: _this.options.region
                };
                function setIfDefined(propertyName, value) {
                  if (value) {
                    payload[propertyName] = value;
                  }
                }
                if (connection) {
                  var callSid = connection.parameters.CallSid;
                  setIfDefined(
                    "call_sid",
                    /^TJ/.test(callSid) ? undefined : callSid
                  );
                  setIfDefined(
                    "temp_call_sid",
                    connection.outboundConnectionId
                  );
                  setIfDefined("audio_codec", connection.codec);
                  payload.direction = connection.direction;
                }
                var stream = _this.stream;
                if (stream) {
                  setIfDefined("gateway", stream.gateway);
                  setIfDefined("region", stream.region);
                }
                return payload;
              };
              _this._disconnectAll = function() {
                var connections = _this.connections.splice(0);
                connections.forEach(function(conn) {
                  return conn.disconnect();
                });
                if (_this._activeConnection) {
                  _this._activeConnection.disconnect();
                }
              };
              _this._onSignalingClose = function() {
                _this.stream = null;
              };
              _this._onSignalingConnected = function(payload) {
                _this._region =
                  regions_1.getRegionShortcode(payload.region) ||
                  payload.region;
                _this._sendPresence();
              };
              _this._onSignalingError = function(payload) {
                var error = payload.error;
                if (!error) {
                  return;
                }
                var sid = payload.callsid;
                if (sid) {
                  error.connection = _this._findConnection(sid);
                }
                if (error.code === 31205) {
                  _this._stopRegistrationTimer();
                }
                _this._log.info("Received error: ", error);
                _this.emit("error", error);
              };
              _this._onSignalingInvite = function(payload) {
                var wasBusy = !!_this._activeConnection;
                if (wasBusy && !_this.options.allowIncomingWhileBusy) {
                  _this._log.info("Device busy; ignoring incoming invite");
                  return;
                }
                if (!payload.callsid || !payload.sdp) {
                  _this.emit("error", {
                    message: "Malformed invite from gateway"
                  });
                  return;
                }
                var callParameters = payload.parameters || {};
                callParameters.CallSid =
                  callParameters.CallSid || payload.callsid;
                var customParameters = Object.assign(
                  {},
                  util_1.queryToJson(callParameters.Params)
                );
                var connection = _this._makeConnection(customParameters, {
                  callParameters: callParameters,
                  offerSdp: payload.sdp
                });
                _this.connections.push(connection);
                connection.once("accept", function() {
                  _this.soundcache.get(Device.SoundName.Incoming).stop();
                  _this._publishNetworkChange();
                });
                var play =
                  _this._enabledSounds.incoming && !wasBusy
                    ? function() {
                        return _this.soundcache
                          .get(Device.SoundName.Incoming)
                          .play();
                      }
                    : function() {
                        return Promise.resolve();
                      };
                _this._showIncomingConnection(connection, play);
              };
              _this._onSignalingOffline = function() {
                _this._log.info("Stream is offline");
                _this._status = Device.Status.Offline;
                _this._region = null;
                _this.emit("offline", _this);
              };
              _this._onSignalingReady = function() {
                _this._log.info("Stream is ready");
                _this._status = Device.Status.Ready;
                _this.emit("ready", _this);
              };
              _this._publishNetworkChange = function() {
                if (!_this._activeConnection) {
                  return;
                }
                if (networkInformation) {
                  _this._publisher.info(
                    "network-information",
                    "network-change",
                    {
                      connection_type: networkInformation.type,
                      downlink: networkInformation.downlink,
                      downlinkMax: networkInformation.downlinkMax,
                      effective_type: networkInformation.effectiveType,
                      rtt: networkInformation.rtt
                    },
                    _this._activeConnection
                  );
                }
              };
              _this._updateInputStream = function(inputStream) {
                var connection = _this._activeConnection;
                if (connection && !inputStream) {
                  return Promise.reject(
                    new Error(
                      "Cannot unset input device while a call is in progress."
                    )
                  );
                }
                _this._connectionInputStream = inputStream;
                return connection
                  ? connection._setInputTracksFromStream(inputStream)
                  : Promise.resolve();
              };
              _this._updateSinkIds = function(type, sinkIds) {
                var promise =
                  type === "ringtone"
                    ? _this._updateRingtoneSinkIds(sinkIds)
                    : _this._updateSpeakerSinkIds(sinkIds);
                return promise.then(
                  function() {
                    _this._publisher.info(
                      "audio",
                      type + "-devices-set",
                      { audio_device_ids: sinkIds },
                      _this._activeConnection
                    );
                  },
                  function(error) {
                    _this._publisher.error(
                      "audio",
                      type + "-devices-set-failed",
                      { audio_device_ids: sinkIds, message: error.message },
                      _this._activeConnection
                    );
                    throw error;
                  }
                );
              };
              if (token) {
                _this.setup(token, options);
              } else if (options) {
                throw new Error(
                  "Cannot construct a Device with options but without a token"
                );
              }
              return _this;
              var _a;
            }
            Object.defineProperty(Device, "audioContext", {
              get: function() {
                return Device._audioContext;
              },
              enumerable: true,
              configurable: true
            });
            Object.defineProperty(Device, "extension", {
              get: function() {
                var a =
                  typeof document !== "undefined"
                    ? document.createElement("audio")
                    : { canPlayType: false };
                var canPlayMp3;
                try {
                  canPlayMp3 =
                    a.canPlayType &&
                    !!a.canPlayType("audio/mpeg").replace(/no/, "");
                } catch (e) {
                  canPlayMp3 = false;
                }
                var canPlayVorbis;
                try {
                  canPlayVorbis =
                    a.canPlayType &&
                    !!a
                      .canPlayType("audio/ogg;codecs='vorbis'")
                      .replace(/no/, "");
                } catch (e) {
                  canPlayVorbis = false;
                }
                return canPlayVorbis && !canPlayMp3 ? "ogg" : "mp3";
              },
              enumerable: true,
              configurable: true
            });
            Object.defineProperty(Device, "isSupported", {
              get: function() {
                return rtc.enabled();
              },
              enumerable: true,
              configurable: true
            });
            Device.toString = function() {
              return "[Twilio.Device class]";
            };
            Object.defineProperty(Device, "version", {
              get: function() {
                return C.RELEASE_VERSION;
              },
              enumerable: true,
              configurable: true
            });
            Device.prototype.activeConnection = function() {
              if (!this.isInitialized) {
                return null;
              }
              return this._activeConnection || this.connections[0];
            };
            Device.prototype.cancel = function(handler) {
              return this._addHandler(Device.EventName.Cancel, handler);
            };
            Device.prototype.connect = function(
              paramsOrHandler,
              audioConstraints
            ) {
              if (typeof paramsOrHandler === "function") {
                this._addHandler(Device.EventName.Connect, paramsOrHandler);
                return null;
              }
              this._throwUnlessSetup("connect");
              if (this._activeConnection) {
                throw new Error("A Connection is already active");
              }
              var params = paramsOrHandler || {};
              audioConstraints =
                audioConstraints ||
                (this.options && this.options.audioConstraints) ||
                {};
              var connection = (this._activeConnection = this._makeConnection(
                params
              ));
              this.connections.splice(0).forEach(function(conn) {
                return conn.ignore();
              });
              this.soundcache.get(Device.SoundName.Incoming).stop();
              connection.accept(audioConstraints);
              this._publishNetworkChange();
              return connection;
            };
            Device.prototype.destroy = function() {
              this._disconnectAll();
              this._stopRegistrationTimer();
              if (this.audio) {
                this.audio._unbind();
              }
              if (this.stream) {
                this.stream.destroy();
                this.stream = null;
              }
              if (networkInformation) {
                networkInformation.removeEventListener(
                  "change",
                  this._publishNetworkChange
                );
              }
              if (typeof window !== "undefined" && window.removeEventListener) {
                window.removeEventListener("beforeunload", this._confirmClose);
                window.removeEventListener("unload", this._disconnectAll);
              }
            };
            Device.prototype.disconnect = function(handler) {
              return this._addHandler(Device.EventName.Disconnect, handler);
            };
            Device.prototype.disconnectAll = function() {
              this._throwUnlessSetup("disconnectAll");
              this._disconnectAll();
            };
            Device.prototype.error = function(handler) {
              return this._addHandler(Device.EventName.Error, handler);
            };
            Device.prototype.incoming = function(handler) {
              return this._addHandler(Device.EventName.Incoming, handler);
            };
            Device.prototype.offline = function(handler) {
              return this._addHandler(Device.EventName.Offline, handler);
            };
            Device.prototype.ready = function(handler) {
              return this._addHandler(Device.EventName.Ready, handler);
            };
            Device.prototype.region = function() {
              this._throwUnlessSetup("region");
              return typeof this._region === "string"
                ? this._region
                : "offline";
            };
            Device.prototype.registerPresence = function() {
              this._throwUnlessSetup("registerPresence");
              this.mediaPresence.audio = true;
              this._sendPresence();
              return this;
            };
            Device.prototype.removeListener = function(event, listener) {
              events_1.EventEmitter.prototype.removeListener.call(
                this,
                event,
                listener
              );
              return this;
            };
            Device.prototype.setup = function(token, options) {
              var _this = this;
              if (options === void 0) {
                options = {};
              }
              if (!Device.isSupported && !options.ignoreBrowserSupport) {
                if (
                  window &&
                  window.location &&
                  window.location.protocol === "http:"
                ) {
                  throw new util_1.Exception(
                    "twilio.js wasn't able to find WebRTC browser support.           This is most likely because this page is served over http rather than https,           which does not support WebRTC in many browsers. Please load this page over https and           try again."
                  );
                }
                throw new util_1.Exception(
                  "twilio.js 1.3+ SDKs require WebRTC/ORTC browser support.         For more information, see <https://www.twilio.com/docs/api/client/twilio-js>.         If you have any questions about this announcement, please contact         Twilio Support at <help@twilio.com>."
                );
              }
              if (!token) {
                throw new util_1.Exception(
                  "Token is required for Device.setup()"
                );
              }
              if (typeof Device._isUnifiedPlanDefault === "undefined") {
                Device._isUnifiedPlanDefault =
                  typeof window !== "undefined" &&
                  typeof RTCPeerConnection !== "undefined" &&
                  typeof RTCRtpTransceiver !== "undefined"
                    ? isUnifiedPlanDefault(
                        window,
                        window.navigator,
                        RTCPeerConnection,
                        RTCRtpTransceiver
                      )
                    : false;
              }
              if (!Device._audioContext) {
                if (typeof AudioContext !== "undefined") {
                  Device._audioContext = new AudioContext();
                } else if (typeof webkitAudioContext !== "undefined") {
                  Device._audioContext = new webkitAudioContext();
                }
              }
              if (Device._audioContext && options.fakeLocalDTMF) {
                if (!Device._dialtonePlayer) {
                  Device._dialtonePlayer = new dialtonePlayer_1.default(
                    Device._audioContext
                  );
                }
              } else if (Device._dialtonePlayer) {
                Device._dialtonePlayer.cleanup();
                delete Device._dialtonePlayer;
              }
              if (this.isInitialized) {
                this._log.info(
                  "Found existing Device; using new token but ignoring options"
                );
                this.updateToken(token);
                return this;
              }
              this.isInitialized = true;
              Object.assign(this.options, options);
              if (this.options.dscp) {
                this.options.rtcConstraints.optional = [{ googDscp: true }];
              }
              this._logLevel = this.options.debug
                ? tslog_1.LogLevel.Debug
                : this.options.warnings
                ? tslog_1.LogLevel.Warn
                : tslog_1.LogLevel.Off;
              this._log = new (this.options.Log || tslog_1.default)(
                this._logLevel
              );
              var getOrSetSound = function(key, value) {
                if (!hasBeenWarnedSounds) {
                  _this._log.warn(
                    "Device.sounds is deprecated and will be removed in the next breaking " +
                      "release. Please use the new functionality available on Device.audio."
                  );
                  hasBeenWarnedSounds = true;
                }
                if (typeof value !== "undefined") {
                  _this._enabledSounds[key] = value;
                }
                return _this._enabledSounds[key];
              };
              [
                Device.SoundName.Disconnect,
                Device.SoundName.Incoming,
                Device.SoundName.Outgoing
              ].forEach(function(eventName) {
                _this.sounds[eventName] = getOrSetSound.bind(null, eventName);
              });
              var regionURI = regions_1.getRegionURI(
                this.options.region,
                function(newRegion) {
                  _this._log.warn(
                    "Region " +
                      _this.options.region +
                      " is deprecated, please use " +
                      newRegion +
                      "."
                  );
                }
              );
              this.options.chunderw =
                "wss://" + (this.options.chunderw || regionURI) + "/signal";
              var defaultSounds = {
                disconnect: { filename: "disconnect", maxDuration: 3e3 },
                dtmf0: { filename: "dtmf-0", maxDuration: 1e3 },
                dtmf1: { filename: "dtmf-1", maxDuration: 1e3 },
                dtmf2: { filename: "dtmf-2", maxDuration: 1e3 },
                dtmf3: { filename: "dtmf-3", maxDuration: 1e3 },
                dtmf4: { filename: "dtmf-4", maxDuration: 1e3 },
                dtmf5: { filename: "dtmf-5", maxDuration: 1e3 },
                dtmf6: { filename: "dtmf-6", maxDuration: 1e3 },
                dtmf7: { filename: "dtmf-7", maxDuration: 1e3 },
                dtmf8: { filename: "dtmf-8", maxDuration: 1e3 },
                dtmf9: { filename: "dtmf-9", maxDuration: 1e3 },
                dtmfh: { filename: "dtmf-hash", maxDuration: 1e3 },
                dtmfs: { filename: "dtmf-star", maxDuration: 1e3 },
                incoming: { filename: "incoming", shouldLoop: true },
                outgoing: { filename: "outgoing", maxDuration: 3e3 }
              };
              for (
                var _i = 0, _a = Object.keys(defaultSounds);
                _i < _a.length;
                _i++
              ) {
                var name_1 = _a[_i];
                var soundDef = defaultSounds[name_1];
                var defaultUrl =
                  C.SOUNDS_BASE_URL +
                  "/" +
                  soundDef.filename +
                  "." +
                  Device.extension +
                  "?cache=1_4_23";
                var soundUrl =
                  (this.options.sounds && this.options.sounds[name_1]) ||
                  defaultUrl;
                var sound = new this.options.soundFactory(name_1, soundUrl, {
                  audioContext: this.options.disableAudioContextSounds
                    ? null
                    : Device.audioContext,
                  maxDuration: soundDef.maxDuration,
                  shouldLoop: soundDef.shouldLoop
                });
                this.soundcache.set(name_1, sound);
              }
              this._publisher = (this.options.Publisher || Publisher)(
                "twilio-js-sdk",
                token,
                {
                  defaultPayload: this._createDefaultPayload,
                  host: this.options.eventgw
                }
              );
              if (this.options.publishEvents === false) {
                this._publisher.disable();
              }
              if (networkInformation) {
                networkInformation.addEventListener(
                  "change",
                  this._publishNetworkChange
                );
              }
              this.audio = new (this.options.AudioHelper ||
                audiohelper_1.default)(
                this._updateSinkIds,
                this._updateInputStream,
                getUserMedia,
                {
                  audioContext: Device.audioContext,
                  enabledSounds: this._enabledSounds,
                  logLevel: this._logLevel
                }
              );
              this.audio.on("deviceChange", function(lostActiveDevices) {
                var activeConnection = _this._activeConnection;
                var deviceIds = lostActiveDevices.map(function(device) {
                  return device.deviceId;
                });
                _this._publisher.info(
                  "audio",
                  "device-change",
                  { lost_active_device_ids: deviceIds },
                  activeConnection
                );
                if (activeConnection) {
                  activeConnection.mediaStream._onInputDevicesChanged();
                }
              });
              this.mediaPresence.audio = !this.options.noRegister;
              this.updateToken(token);
              if (typeof window !== "undefined" && window.addEventListener) {
                window.addEventListener("unload", this._disconnectAll);
                if (this.options.closeProtection) {
                  window.addEventListener("beforeunload", this._confirmClose);
                }
              }
              this.on(Device.EventName.Error, function() {
                if (_this.listenerCount("error") > 1) {
                  return;
                }
                _this._log.info("Uncaught error event suppressed.");
              });
              return this;
            };
            Device.prototype.status = function() {
              this._throwUnlessSetup("status");
              return this._activeConnection ? Device.Status.Busy : this._status;
            };
            Device.prototype.toString = function() {
              return "[Twilio.Device instance]";
            };
            Device.prototype.unregisterPresence = function() {
              this._throwUnlessSetup("unregisterPresence");
              this.mediaPresence.audio = false;
              this._sendPresence();
              return this;
            };
            Device.prototype.updateToken = function(token) {
              this._throwUnlessSetup("updateToken");
              this.token = token;
              this.register(token);
            };
            Device.prototype._addHandler = function(eventName, handler) {
              if (!hasBeenWarnedHandlers) {
                this._log.warn(
                  "Device callback handlers (connect, error, offline, incoming, cancel, ready, disconnect)         have been deprecated and will be removed in the next breaking release. Instead, the EventEmitter         interface can be used to set event listeners. Example: device.on('" +
                    eventName +
                    "', handler)"
                );
                hasBeenWarnedHandlers = true;
              }
              this.addListener(eventName, handler);
              return this;
            };
            Device.prototype._findConnection = function(callSid) {
              return (
                this.connections.find(function(conn) {
                  return (
                    conn.parameters.CallSid === callSid ||
                    conn.outboundConnectionId === callSid
                  );
                }) || null
              );
            };
            Device.prototype._makeConnection = function(twimlParams, options) {
              var _this = this;
              if (typeof Device._isUnifiedPlanDefault === "undefined") {
                throw new Error("Device has not been initialized.");
              }
              var config = {
                audioHelper: this.audio,
                getUserMedia: getUserMedia,
                isUnifiedPlanDefault: Device._isUnifiedPlanDefault,
                pstream: this.stream,
                publisher: this._publisher,
                soundcache: this.soundcache
              };
              options = Object.assign(
                {
                  MediaStream:
                    this.options.MediaStream ||
                    this.options.mediaStreamFactory ||
                    rtc.PeerConnection,
                  audioConstraints: this.options.audioConstraints,
                  beforeAccept: function(conn) {
                    if (
                      !_this._activeConnection ||
                      _this._activeConnection === conn
                    ) {
                      return;
                    }
                    _this._activeConnection.disconnect();
                    _this._removeConnection(_this._activeConnection);
                  },
                  codecPreferences: this.options.codecPreferences,
                  debug: this.options.debug,
                  dialtonePlayer: Device._dialtonePlayer,
                  dscp: this.options.dscp,
                  enableIceRestart: this.options.enableIceRestart,
                  enableRingingState: this.options.enableRingingState,
                  getInputStream: function() {
                    return _this._connectionInputStream;
                  },
                  getSinkIds: function() {
                    return _this._connectionSinkIds;
                  },
                  rtcConfiguration: this.options.rtcConfiguration || {
                    iceServers: this.options.iceServers
                  },
                  rtcConstraints: this.options.rtcConstraints,
                  shouldPlayDisconnect: function() {
                    return _this._enabledSounds.disconnect;
                  },
                  twimlParams: twimlParams,
                  warnings: this.options.warnings
                },
                options
              );
              var connection = new this.options.connectionFactory(
                config,
                options
              );
              connection.once("accept", function() {
                _this._removeConnection(connection);
                _this._activeConnection = connection;
                if (_this.audio) {
                  _this.audio._maybeStartPollingVolume();
                }
                if (
                  connection.direction ===
                    connection_1.default.CallDirection.Outgoing &&
                  _this._enabledSounds.outgoing
                ) {
                  _this.soundcache.get(Device.SoundName.Outgoing).play();
                }
                _this.emit("connect", connection);
              });
              connection.addListener("error", function(error) {
                if (connection.status() === "closed") {
                  _this._removeConnection(connection);
                }
                if (_this.audio) {
                  _this.audio._maybeStopPollingVolume();
                }
                _this._maybeStopIncomingSound();
                _this.emit("error", error);
              });
              connection.once("cancel", function() {
                _this._log.info("Canceled: " + connection.parameters.CallSid);
                _this._removeConnection(connection);
                if (_this.audio) {
                  _this.audio._maybeStopPollingVolume();
                }
                _this._maybeStopIncomingSound();
                _this.emit("cancel", connection);
              });
              connection.once("disconnect", function() {
                if (_this.audio) {
                  _this.audio._maybeStopPollingVolume();
                }
                _this._removeConnection(connection);
                _this.emit("disconnect", connection);
              });
              connection.once("reject", function() {
                _this._log.info("Rejected: " + connection.parameters.CallSid);
                if (_this.audio) {
                  _this.audio._maybeStopPollingVolume();
                }
                _this._removeConnection(connection);
                _this._maybeStopIncomingSound();
              });
              return connection;
            };
            Device.prototype._maybeStopIncomingSound = function() {
              if (!this.connections.length) {
                this.soundcache.get(Device.SoundName.Incoming).stop();
              }
            };
            Device.prototype._removeConnection = function(connection) {
              if (this._activeConnection === connection) {
                this._activeConnection = null;
              }
              for (var i = this.connections.length - 1; i >= 0; i--) {
                if (connection === this.connections[i]) {
                  this.connections.splice(i, 1);
                }
              }
            };
            Device.prototype._sendPresence = function() {
              if (!this.stream) {
                return;
              }
              this.stream.register({ audio: this.mediaPresence.audio });
              if (this.mediaPresence.audio) {
                this._startRegistrationTimer();
              } else {
                this._stopRegistrationTimer();
              }
            };
            Device.prototype._setupStream = function(token) {
              this._log.info("Setting up VSP");
              this.stream = this.options.pStreamFactory(
                token,
                this.options.chunderw,
                {
                  backoffMaxMs: this.options.backoffMaxMs,
                  debug: this.options.debug
                }
              );
              this.stream.addListener("close", this._onSignalingClose);
              this.stream.addListener("connected", this._onSignalingConnected);
              this.stream.addListener("error", this._onSignalingError);
              this.stream.addListener("invite", this._onSignalingInvite);
              this.stream.addListener("offline", this._onSignalingOffline);
              this.stream.addListener("ready", this._onSignalingReady);
            };
            Device.prototype._showIncomingConnection = function(
              connection,
              play
            ) {
              var _this = this;
              var timeout;
              return Promise.race([
                play(),
                new Promise(function(resolve, reject) {
                  timeout = setTimeout(function() {
                    reject(
                      new Error(
                        "Playing incoming ringtone took too long; it might not play. Continuing execution..."
                      )
                    );
                  }, RINGTONE_PLAY_TIMEOUT);
                })
              ])
                .catch(function(reason) {
                  _this._log.info(reason.message);
                })
                .then(function() {
                  clearTimeout(timeout);
                  _this.emit("incoming", connection);
                });
            };
            Device.prototype._startRegistrationTimer = function() {
              var _this = this;
              this._stopRegistrationTimer();
              this.regTimer = setTimeout(function() {
                _this._sendPresence();
              }, REGISTRATION_INTERVAL);
            };
            Device.prototype._stopRegistrationTimer = function() {
              if (this.regTimer) {
                clearTimeout(this.regTimer);
              }
            };
            Device.prototype._throwUnlessSetup = function(methodName) {
              if (!this.isInitialized) {
                throw new Error("Call Device.setup() before " + methodName);
              }
            };
            Device.prototype._updateRingtoneSinkIds = function(sinkIds) {
              return Promise.resolve(
                this.soundcache
                  .get(Device.SoundName.Incoming)
                  .setSinkIds(sinkIds)
              );
            };
            Device.prototype._updateSpeakerSinkIds = function(sinkIds) {
              Array.from(this.soundcache.entries())
                .filter(function(entry) {
                  return entry[0] !== Device.SoundName.Incoming;
                })
                .forEach(function(entry) {
                  return entry[1].setSinkIds(sinkIds);
                });
              this._connectionSinkIds = sinkIds;
              var connection = this._activeConnection;
              return connection
                ? connection._setSinkIds(sinkIds)
                : Promise.resolve();
            };
            Device.prototype.register = function(token) {
              if (this.stream) {
                this.stream.setToken(token);
                this._publisher.setToken(token);
              } else {
                this._setupStream(token);
              }
            };
            return Device;
          })(events_1.EventEmitter);
          (function(Device) {
            var EventName;
            (function(EventName) {
              EventName["Cancel"] = "cancel";
              EventName["Connect"] = "connect";
              EventName["Disconnect"] = "disconnect";
              EventName["Error"] = "error";
              EventName["Incoming"] = "incoming";
              EventName["Offline"] = "offline";
              EventName["Ready"] = "ready";
            })((EventName = Device.EventName || (Device.EventName = {})));
            var Status;
            (function(Status) {
              Status["Busy"] = "busy";
              Status["Offline"] = "offline";
              Status["Ready"] = "ready";
            })((Status = Device.Status || (Device.Status = {})));
            var SoundName;
            (function(SoundName) {
              SoundName["Incoming"] = "incoming";
              SoundName["Outgoing"] = "outgoing";
              SoundName["Disconnect"] = "disconnect";
              SoundName["Dtmf0"] = "dtmf0";
              SoundName["Dtmf1"] = "dtmf1";
              SoundName["Dtmf2"] = "dtmf2";
              SoundName["Dtmf3"] = "dtmf3";
              SoundName["Dtmf4"] = "dtmf4";
              SoundName["Dtmf5"] = "dtmf5";
              SoundName["Dtmf6"] = "dtmf6";
              SoundName["Dtmf7"] = "dtmf7";
              SoundName["Dtmf8"] = "dtmf8";
              SoundName["Dtmf9"] = "dtmf9";
              SoundName["DtmfS"] = "dtmfs";
              SoundName["DtmfH"] = "dtmfh";
            })((SoundName = Device.SoundName || (Device.SoundName = {})));
          })(Device || (Device = {}));
          exports.default = Device;
        },
        {
          "./audiohelper": 4,
          "./connection": 5,
          "./constants": 6,
          "./dialtonePlayer": 8,
          "./eventpublisher": 9,
          "./pstream": 12,
          "./regions": 13,
          "./rtc": 16,
          "./rtc/getusermedia": 15,
          "./sound": 27,
          "./tslog": 28,
          "./util": 29,
          events: 42
        }
      ],
      8: [
        function(require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var bandFrequencies = {
            dtmf0: [1360, 960],
            dtmf1: [1230, 720],
            dtmf2: [1360, 720],
            dtmf3: [1480, 720],
            dtmf4: [1230, 790],
            dtmf5: [1360, 790],
            dtmf6: [1480, 790],
            dtmf7: [1230, 870],
            dtmf8: [1360, 870],
            dtmf9: [1480, 870],
            dtmfh: [1480, 960],
            dtmfs: [1230, 960]
          };
          var DialtonePlayer = (function() {
            function DialtonePlayer(_context) {
              var _this = this;
              this._context = _context;
              this._gainNodes = [];
              this._gainNodes = [
                this._context.createGain(),
                this._context.createGain()
              ];
              this._gainNodes.forEach(function(gainNode) {
                gainNode.connect(_this._context.destination);
                gainNode.gain.value = 0.1;
                _this._gainNodes.push(gainNode);
              });
            }
            DialtonePlayer.prototype.cleanup = function() {
              this._gainNodes.forEach(function(gainNode) {
                gainNode.disconnect();
              });
            };
            DialtonePlayer.prototype.play = function(sound) {
              var _this = this;
              var frequencies = bandFrequencies[sound];
              if (!frequencies) {
                throw new Error("Invalid DTMF sound name");
              }
              var oscillators = [
                this._context.createOscillator(),
                this._context.createOscillator()
              ];
              oscillators.forEach(function(oscillator, i) {
                oscillator.type = "sine";
                oscillator.frequency.value = frequencies[i];
                oscillator.connect(_this._gainNodes[i]);
                oscillator.start();
                oscillator.stop(_this._context.currentTime + 0.1);
                oscillator.addEventListener("ended", function() {
                  return oscillator.disconnect();
                });
              });
            };
            return DialtonePlayer;
          })();
          exports.default = DialtonePlayer;
        },
        {}
      ],
      9: [
        function(require, module, exports) {
          "use strict";
          var request = require("./request");
          function EventPublisher(productName, token, options) {
            if (!(this instanceof EventPublisher)) {
              return new EventPublisher(productName, token, options);
            }
            options = Object.assign(
              {
                defaultPayload: function defaultPayload() {
                  return {};
                },
                host: "eventgw.twilio.com"
              },
              options
            );
            var defaultPayload = options.defaultPayload;
            if (typeof defaultPayload !== "function") {
              defaultPayload = function defaultPayload() {
                return Object.assign({}, options.defaultPayload);
              };
            }
            var isEnabled = true;
            Object.defineProperties(this, {
              _defaultPayload: { value: defaultPayload },
              _isEnabled: {
                get: function get() {
                  return isEnabled;
                },
                set: function set(_isEnabled) {
                  isEnabled = _isEnabled;
                }
              },
              _host: { value: options.host },
              _request: { value: options.request || request, writable: true },
              _token: { value: token, writable: true },
              isEnabled: {
                enumerable: true,
                get: function get() {
                  return isEnabled;
                }
              },
              productName: { enumerable: true, value: productName },
              token: {
                enumerable: true,
                get: function get() {
                  return this._token;
                }
              }
            });
          }
          EventPublisher.prototype._post = function _post(
            endpointName,
            level,
            group,
            name,
            payload,
            connection,
            force
          ) {
            if (!this.isEnabled && !force) {
              return Promise.resolve();
            }
            if (
              !connection ||
              ((!connection.parameters || !connection.parameters.CallSid) &&
                !connection.outboundConnectionId)
            ) {
              return Promise.resolve();
            }
            var event = {
              publisher: this.productName,
              group: group,
              name: name,
              timestamp: new Date().toISOString(),
              level: level.toUpperCase(),
              payload_type: "application/json",
              private: false,
              payload:
                payload && payload.forEach
                  ? payload.slice(0)
                  : Object.assign(this._defaultPayload(connection), payload)
            };
            var requestParams = {
              url: "https://" + this._host + "/v4/" + endpointName,
              body: event,
              headers: {
                "Content-Type": "application/json",
                "X-Twilio-Token": this.token
              }
            };
            var self = this;
            return new Promise(function(resolve, reject) {
              self._request.post(requestParams, function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          };
          EventPublisher.prototype.post = function post(
            level,
            group,
            name,
            payload,
            connection,
            force
          ) {
            return this._post(
              "EndpointEvents",
              level,
              group,
              name,
              payload,
              connection,
              force
            );
          };
          EventPublisher.prototype.debug = function debug(
            group,
            name,
            payload,
            connection
          ) {
            return this.post("debug", group, name, payload, connection);
          };
          EventPublisher.prototype.info = function info(
            group,
            name,
            payload,
            connection
          ) {
            return this.post("info", group, name, payload, connection);
          };
          EventPublisher.prototype.warn = function warn(
            group,
            name,
            payload,
            connection
          ) {
            return this.post("warning", group, name, payload, connection);
          };
          EventPublisher.prototype.error = function error(
            group,
            name,
            payload,
            connection
          ) {
            return this.post("error", group, name, payload, connection);
          };
          EventPublisher.prototype.postMetrics = function postMetrics(
            group,
            name,
            metrics,
            customFields,
            connection
          ) {
            var _this = this;
            return new Promise(function(resolve) {
              var samples = metrics.map(formatMetric).map(function(sample) {
                return Object.assign(sample, customFields);
              });
              resolve(
                _this._post(
                  "EndpointMetrics",
                  "info",
                  group,
                  name,
                  samples,
                  connection
                )
              );
            });
          };
          EventPublisher.prototype.setToken = function setToken(token) {
            this._token = token;
          };
          EventPublisher.prototype.enable = function enable() {
            this._isEnabled = true;
          };
          EventPublisher.prototype.disable = function disable() {
            this._isEnabled = false;
          };
          function formatMetric(sample) {
            return {
              timestamp: new Date(sample.timestamp).toISOString(),
              total_packets_received: sample.totals.packetsReceived,
              total_packets_lost: sample.totals.packetsLost,
              total_packets_sent: sample.totals.packetsSent,
              total_bytes_received: sample.totals.bytesReceived,
              total_bytes_sent: sample.totals.bytesSent,
              packets_received: sample.packetsReceived,
              packets_lost: sample.packetsLost,
              packets_lost_fraction:
                sample.packetsLostFraction &&
                Math.round(sample.packetsLostFraction * 100) / 100,
              bytes_received: sample.bytesReceived,
              bytes_sent: sample.bytesSent,
              audio_codec: sample.codecName,
              audio_level_in: sample.audioInputLevel,
              audio_level_out: sample.audioOutputLevel,
              call_volume_input: sample.inputVolume,
              call_volume_output: sample.outputVolume,
              jitter: sample.jitter,
              rtt: sample.rtt,
              mos: sample.mos && Math.round(sample.mos * 100) / 100
            };
          }
          module.exports = EventPublisher;
        },
        { "./request": 14 }
      ],
      10: [
        function(require, module, exports) {
          function mixinLog(object, prefix) {
            function log() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              if (!log.enabled) {
                return;
              }
              var format = log.prefix ? log.prefix + " " : "";
              for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                log.handler(typeof arg === "string" ? format + arg : arg);
              }
            }
            function defaultWarnHandler(x) {
              if (typeof console !== "undefined") {
                if (typeof console.warn === "function") {
                  console.warn(x);
                } else if (typeof console.log === "function") {
                  console.log(x);
                }
              }
            }
            function deprecated() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              if (!log.warnings) {
                return;
              }
              for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                log.warnHandler(arg);
              }
            }
            log.enabled = true;
            log.prefix = prefix || "";
            log.defaultHandler = function(x) {
              if (typeof console !== "undefined") {
                console.log(x);
              }
            };
            log.handler = log.defaultHandler;
            log.warnings = true;
            log.defaultWarnHandler = defaultWarnHandler;
            log.warnHandler = log.defaultWarnHandler;
            log.deprecated = deprecated;
            log.warn = deprecated;
            object.log = log;
          }
          exports.mixinLog = mixinLog;
        },
        {}
      ],
      11: [
        function(require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var constants_1 = require("./constants");
          var DEFAULT_TEST_SOUND_URL =
            constants_1.SOUNDS_BASE_URL + "/outgoing.mp3";
          var OutputDeviceCollection = (function() {
            function OutputDeviceCollection(
              _name,
              _availableDevices,
              _beforeChange,
              _isSupported
            ) {
              this._name = _name;
              this._availableDevices = _availableDevices;
              this._beforeChange = _beforeChange;
              this._isSupported = _isSupported;
              this._activeDevices = new Set();
            }
            OutputDeviceCollection.prototype.delete = function(device) {
              var wasDeleted = !!this._activeDevices.delete(device);
              var defaultDevice =
                this._availableDevices.get("default") ||
                Array.from(this._availableDevices.values())[0];
              if (!this._activeDevices.size && defaultDevice) {
                this._activeDevices.add(defaultDevice);
              }
              var deviceIds = Array.from(this._activeDevices.values()).map(
                function(deviceInfo) {
                  return deviceInfo.deviceId;
                }
              );
              this._beforeChange(this._name, deviceIds);
              return !!wasDeleted;
            };
            OutputDeviceCollection.prototype.get = function() {
              return this._activeDevices;
            };
            OutputDeviceCollection.prototype.set = function(deviceIdOrIds) {
              var _this = this;
              if (!this._isSupported) {
                return Promise.reject(
                  new Error(
                    "This browser does not support audio output selection"
                  )
                );
              }
              var deviceIds = Array.isArray(deviceIdOrIds)
                ? deviceIdOrIds
                : [deviceIdOrIds];
              if (!deviceIds.length) {
                return Promise.reject(
                  new Error("Must specify at least one device to set")
                );
              }
              var missingIds = [];
              var devices = deviceIds.map(function(id) {
                var device = _this._availableDevices.get(id);
                if (!device) {
                  missingIds.push(id);
                }
                return device;
              });
              if (missingIds.length) {
                return Promise.reject(
                  new Error("Devices not found: " + missingIds.join(", "))
                );
              }
              return new Promise(function(resolve) {
                resolve(_this._beforeChange(_this._name, deviceIds));
              }).then(function() {
                _this._activeDevices.clear();
                devices.forEach(_this._activeDevices.add, _this._activeDevices);
              });
            };
            OutputDeviceCollection.prototype.test = function(soundUrl) {
              if (soundUrl === void 0) {
                soundUrl = DEFAULT_TEST_SOUND_URL;
              }
              if (!this._isSupported) {
                return Promise.reject(
                  new Error(
                    "This browser does not support audio output selection"
                  )
                );
              }
              if (!this._activeDevices.size) {
                return Promise.reject(
                  new Error("No active output devices to test")
                );
              }
              return Promise.all(
                Array.from(this._activeDevices).map(function(device) {
                  var el;
                  return new Promise(function(resolve) {
                    el = new Audio(soundUrl);
                    el.oncanplay = resolve;
                  }).then(function() {
                    return el.setSinkId(device.deviceId).then(function() {
                      return el.play();
                    });
                  });
                })
              );
            };
            return OutputDeviceCollection;
          })();
          exports.default = OutputDeviceCollection;
        },
        { "./constants": 6 }
      ],
      12: [
        function(require, module, exports) {
          var C = require("./constants");
          var EventEmitter = require("events").EventEmitter;
          var util = require("util");
          var log = require("./log");
          var WSTransport = require("./wstransport").default;
          var PSTREAM_VERSION = "1.5";
          function PStream(token, uri, options) {
            if (!(this instanceof PStream)) {
              return new PStream(token, uri, options);
            }
            var defaults = {
              logPrefix: "[PStream]",
              TransportFactory: WSTransport,
              debug: false
            };
            options = options || {};
            for (var prop in defaults) {
              if (prop in options) continue;
              options[prop] = defaults[prop];
            }
            this.options = options;
            this.token = token || "";
            this.status = "disconnected";
            this.uri = uri;
            this.gateway = null;
            this.region = null;
            this._messageQueue = [];
            this._handleTransportClose = this._handleTransportClose.bind(this);
            this._handleTransportError = this._handleTransportError.bind(this);
            this._handleTransportMessage = this._handleTransportMessage.bind(
              this
            );
            this._handleTransportOpen = this._handleTransportOpen.bind(this);
            log.mixinLog(this, this.options.logPrefix);
            this.log.enabled = this.options.debug;
            this.on("error", function() {});
            var self = this;
            this.addListener("ready", function() {
              self.status = "ready";
            });
            this.addListener("offline", function() {
              self.status = "offline";
            });
            this.addListener("close", function() {
              self.log('Received "close" from server. Destroying PStream...');
              self._destroy();
            });
            this.transport = new this.options.TransportFactory(this.uri, {
              backoffMaxMs: this.options.backoffMaxMs,
              logLevel: this.options.debug ? "debug" : "off"
            });
            this.transport.on("close", this._handleTransportClose);
            this.transport.on("error", this._handleTransportError);
            this.transport.on("message", this._handleTransportMessage);
            this.transport.on("open", this._handleTransportOpen);
            this.transport.open();
            return this;
          }
          util.inherits(PStream, EventEmitter);
          PStream.prototype._handleTransportClose = function() {
            this.emit("transportClosed");
            if (this.status !== "disconnected") {
              if (this.status !== "offline") {
                this.emit("offline", this);
              }
              this.status = "disconnected";
            }
          };
          PStream.prototype._handleTransportError = function(error) {
            if (!error) {
              this.emit("error", {
                error: {
                  code: 31e3,
                  message: "Websocket closed without a provided reason"
                }
              });
              return;
            }
            this.emit(
              "error",
              typeof error.code !== "undefined" ? { error: error } : error
            );
          };
          PStream.prototype._handleTransportMessage = function(msg) {
            if (!msg || !msg.data || typeof msg.data !== "string") {
              return;
            }
            var _a = JSON.parse(msg.data),
              type = _a.type,
              _b = _a.payload,
              payload = _b === void 0 ? {} : _b;
            this.gateway = payload.gateway || this.gateway;
            this.region = payload.region || this.region;
            this.emit(type, payload);
          };
          PStream.prototype._handleTransportOpen = function() {
            var _this = this;
            this.status = "connected";
            this.setToken(this.token);
            var messages = this._messageQueue.splice(
              0,
              this._messageQueue.length
            );
            messages.forEach(function(message) {
              return _this._publish.apply(_this, message);
            });
          };
          PStream.toString = function() {
            return "[Twilio.PStream class]";
          };
          PStream.prototype.toString = function() {
            return "[Twilio.PStream instance]";
          };
          PStream.prototype.setToken = function(token) {
            this.log("Setting token and publishing listen");
            this.token = token;
            var payload = { token: token, browserinfo: getBrowserInfo() };
            this._publish("listen", payload);
          };
          PStream.prototype.register = function(mediaCapabilities) {
            var regPayload = { media: mediaCapabilities };
            this._publish("register", regPayload, true);
          };
          PStream.prototype.reinvite = function(sdp, callsid) {
            this._publish("reinvite", { sdp: sdp, callsid: callsid }, false);
          };
          PStream.prototype._destroy = function() {
            this.transport.removeListener("close", this._handleTransportClose);
            this.transport.removeListener("error", this._handleTransportError);
            this.transport.removeListener(
              "message",
              this._handleTransportMessage
            );
            this.transport.removeListener("open", this._handleTransportOpen);
            this.transport.close();
            this.emit("offline", this);
          };
          PStream.prototype.destroy = function() {
            this.log("PStream.destroy() called...");
            this._destroy();
            return this;
          };
          PStream.prototype.publish = function(type, payload) {
            return this._publish(type, payload, true);
          };
          PStream.prototype._publish = function(type, payload, shouldRetry) {
            var msg = JSON.stringify({
              type: type,
              version: PSTREAM_VERSION,
              payload: payload
            });
            if (!this.transport.send(msg) && shouldRetry) {
              this._messageQueue.push([type, payload, true]);
            }
          };
          function getBrowserInfo() {
            var nav = typeof navigator !== "undefined" ? navigator : {};
            var info = {
              p: "browser",
              v: C.RELEASE_VERSION,
              browser: {
                userAgent: nav.userAgent || "unknown",
                platform: nav.platform || "unknown"
              },
              plugin: "rtc"
            };
            return info;
          }
          exports.PStream = PStream;
        },
        {
          "./constants": 6,
          "./log": 10,
          "./wstransport": 30,
          events: 42,
          util: 53
        }
      ],
      13: [
        function(require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var util_1 = require("./util");
          var DeprecatedRegion;
          (function(DeprecatedRegion) {
            DeprecatedRegion["Au"] = "au";
            DeprecatedRegion["Br"] = "br";
            DeprecatedRegion["Ie"] = "ie";
            DeprecatedRegion["Jp"] = "jp";
            DeprecatedRegion["Sg"] = "sg";
            DeprecatedRegion["UsOr"] = "us-or";
            DeprecatedRegion["UsVa"] = "us-va";
          })(
            (DeprecatedRegion =
              exports.DeprecatedRegion || (exports.DeprecatedRegion = {}))
          );
          var Region;
          (function(Region) {
            Region["Au1"] = "au1";
            Region["Br1"] = "br1";
            Region["De1"] = "de1";
            Region["De1Ix"] = "de1-ix";
            Region["Gll"] = "gll";
            Region["Ie1"] = "ie1";
            Region["Ie1Ix"] = "ie1-ix";
            Region["Ie1Tnx"] = "ie1-tnx";
            Region["Jp1"] = "jp1";
            Region["Sg1"] = "sg1";
            Region["Us1"] = "us1";
            Region["Us1Ix"] = "us1-ix";
            Region["Us1Tnx"] = "us1-tnx";
            Region["Us2"] = "us2";
            Region["Us2Ix"] = "us2-ix";
            Region["Us2Tnx"] = "us2-tnx";
          })((Region = exports.Region || (exports.Region = {})));
          var deprecatedRegions = ((_a = {}),
          (_a[DeprecatedRegion.Au] = Region.Au1),
          (_a[DeprecatedRegion.Br] = Region.Br1),
          (_a[DeprecatedRegion.Ie] = Region.Ie1),
          (_a[DeprecatedRegion.Jp] = Region.Jp1),
          (_a[DeprecatedRegion.Sg] = Region.Sg1),
          (_a[DeprecatedRegion.UsOr] = Region.Us1),
          (_a[DeprecatedRegion.UsVa] = Region.Us1),
          _a);
          exports.regionShortcodes = {
            ASIAPAC_SINGAPORE: Region.Sg1,
            ASIAPAC_SYDNEY: Region.Au1,
            ASIAPAC_TOKYO: Region.Jp1,
            EU_FRANKFURT: Region.De1,
            EU_IRELAND: Region.Ie1,
            SOUTH_AMERICA_SAO_PAULO: Region.Br1,
            US_EAST_VIRGINIA: Region.Us1,
            US_WEST_OREGON: Region.Us2
          };
          var regionURIs = ((_b = {}),
          (_b[Region.Au1] = "chunderw-vpc-gll-au1.twilio.com"),
          (_b[Region.Br1] = "chunderw-vpc-gll-br1.twilio.com"),
          (_b[Region.De1] = "chunderw-vpc-gll-de1.twilio.com"),
          (_b[Region.De1Ix] = "chunderw-vpc-gll-de1-ix.twilio.com"),
          (_b[Region.Gll] = "chunderw-vpc-gll.twilio.com"),
          (_b[Region.Ie1] = "chunderw-vpc-gll-ie1.twilio.com"),
          (_b[Region.Ie1Ix] = "chunderw-vpc-gll-ie1-ix.twilio.com"),
          (_b[Region.Ie1Tnx] = "chunderw-vpc-gll-ie1-tnx.twilio.com"),
          (_b[Region.Jp1] = "chunderw-vpc-gll-jp1.twilio.com"),
          (_b[Region.Sg1] = "chunderw-vpc-gll-sg1.twilio.com"),
          (_b[Region.Us1] = "chunderw-vpc-gll-us1.twilio.com"),
          (_b[Region.Us1Ix] = "chunderw-vpc-gll-us1-ix.twilio.com"),
          (_b[Region.Us1Tnx] = "chunderw-vpc-gll-us1-tnx.twilio.com"),
          (_b[Region.Us2] = "chunderw-vpc-gll-us2.twilio.com"),
          (_b[Region.Us2Ix] = "chunderw-vpc-gll-us2-ix.twilio.com"),
          (_b[Region.Us2Tnx] = "chunderw-vpc-gll-us2-tnx.twilio.com"),
          _b);
          function getRegionURI(region, onDeprecated) {
            if (region === void 0) {
              region = Region.Gll;
            }
            if (Object.values(DeprecatedRegion).includes(region)) {
              region = deprecatedRegions[region];
              if (onDeprecated) {
                setTimeout(function() {
                  return onDeprecated(region);
                });
              }
            } else if (!Object.values(Region).includes(region)) {
              throw new util_1.Exception(
                "Region " +
                  region +
                  " is invalid. Valid values are: " +
                  Object.keys(regionURIs).join(", ")
              );
            }
            return regionURIs[region];
          }
          exports.getRegionURI = getRegionURI;
          function getRegionShortcode(region) {
            return exports.regionShortcodes[region] || null;
          }
          exports.getRegionShortcode = getRegionShortcode;
          var _a, _b;
        },
        { "./util": 29 }
      ],
      14: [
        function(require, module, exports) {
          "use strict";
          var XHR = require("xmlhttprequest").XMLHttpRequest;
          function request(method, params, callback) {
            var options = {};
            options.XMLHttpRequest = options.XMLHttpRequest || XHR;
            var xhr = new options.XMLHttpRequest();
            xhr.open(method, params.url, true);
            xhr.onreadystatechange = function onreadystatechange() {
              if (xhr.readyState !== 4) {
                return;
              }
              if (200 <= xhr.status && xhr.status < 300) {
                callback(null, xhr.responseText);
                return;
              }
              callback(new Error(xhr.responseText));
            };
            for (var headerName in params.headers) {
              xhr.setRequestHeader(headerName, params.headers[headerName]);
            }
            xhr.send(JSON.stringify(params.body));
          }
          var Request = request;
          Request.get = function get(params, callback) {
            return new this("GET", params, callback);
          };
          Request.post = function post(params, callback) {
            return new this("POST", params, callback);
          };
          module.exports = Request;
        },
        { xmlhttprequest: 2 }
      ],
      15: [
        function(require, module, exports) {
          "use strict";
          var _typeof =
            typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
              ? function(obj) {
                  return typeof obj;
                }
              : function(obj) {
                  return obj &&
                    typeof Symbol === "function" &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? "symbol"
                    : typeof obj;
                };
          var util = require("../util");
          function getUserMedia(constraints, options) {
            options = options || {};
            options.util = options.util || util;
            options.navigator =
              options.navigator ||
              (typeof navigator !== "undefined" ? navigator : null);
            return new Promise(function(resolve, reject) {
              if (!options.navigator) {
                throw new Error("getUserMedia is not supported");
              }
              switch ("function") {
                case _typeof(
                  options.navigator.mediaDevices &&
                    options.navigator.mediaDevices.getUserMedia
                ):
                  return resolve(
                    options.navigator.mediaDevices.getUserMedia(constraints)
                  );
                case _typeof(options.navigator.webkitGetUserMedia):
                  return options.navigator.webkitGetUserMedia(
                    constraints,
                    resolve,
                    reject
                  );
                case _typeof(options.navigator.mozGetUserMedia):
                  return options.navigator.mozGetUserMedia(
                    constraints,
                    resolve,
                    reject
                  );
                case _typeof(options.navigator.getUserMedia):
                  return options.navigator.getUserMedia(
                    constraints,
                    resolve,
                    reject
                  );
                default:
                  throw new Error("getUserMedia is not supported");
              }
            }).catch(function(e) {
              throw options.util.isFirefox() && e.name === "NotReadableError"
                ? new Error(
                    "Firefox does not currently support opening multiple audio input tracks" +
                      "simultaneously, even across different tabs.\n" +
                      "Related Bugzilla thread: https://bugzilla.mozilla.org/show_bug.cgi?id=1299324"
                  )
                : e;
            });
          }
          module.exports = getUserMedia;
        },
        { "../util": 29 }
      ],
      16: [
        function(require, module, exports) {
          "use strict";
          var PeerConnection = require("./peerconnection");
          var _require = require("./rtcpc"),
            test = _require.test;
          function enabled() {
            return test();
          }
          function getMediaEngine() {
            return typeof RTCIceGatherer !== "undefined" ? "ORTC" : "WebRTC";
          }
          module.exports = {
            enabled: enabled,
            getMediaEngine: getMediaEngine,
            PeerConnection: PeerConnection
          };
        },
        { "./peerconnection": 20, "./rtcpc": 21 }
      ],
      17: [
        function(require, module, exports) {
          "use strict";
          var OLD_MAX_VOLUME = 32767;
          var NativeRTCStatsReport =
            typeof window !== "undefined" ? window.RTCStatsReport : undefined;
          function MockRTCStatsReport(statsMap) {
            if (!(this instanceof MockRTCStatsReport)) {
              return new MockRTCStatsReport(statsMap);
            }
            var self = this;
            Object.defineProperties(this, {
              size: {
                enumerable: true,
                get: function get() {
                  return self._map.size;
                }
              },
              _map: { value: statsMap }
            });
            this[Symbol.iterator] = statsMap[Symbol.iterator];
          }
          if (NativeRTCStatsReport) {
            MockRTCStatsReport.prototype = Object.create(
              NativeRTCStatsReport.prototype
            );
            MockRTCStatsReport.prototype.constructor = MockRTCStatsReport;
          }
          ["entries", "forEach", "get", "has", "keys", "values"].forEach(
            function(key) {
              MockRTCStatsReport.prototype[key] = function() {
                var _map;
                return (_map = this._map)[key].apply(_map, arguments);
              };
            }
          );
          MockRTCStatsReport.fromArray = function fromArray(array) {
            return new MockRTCStatsReport(
              array.reduce(function(map, rtcStats) {
                map.set(rtcStats.id, rtcStats);
                return map;
              }, new Map())
            );
          };
          MockRTCStatsReport.fromRTCStatsResponse = function fromRTCStatsResponse(
            statsResponse
          ) {
            var activeCandidatePairId = void 0;
            var transportIds = new Map();
            var statsMap = statsResponse.result().reduce(function(map, report) {
              var id = report.id;
              switch (report.type) {
                case "googCertificate":
                  map.set(id, createRTCCertificateStats(report));
                  break;
                case "datachannel":
                  map.set(id, createRTCDataChannelStats(report));
                  break;
                case "googCandidatePair":
                  if (getBoolean(report, "googActiveConnection")) {
                    activeCandidatePairId = id;
                  }
                  map.set(id, createRTCIceCandidatePairStats(report));
                  break;
                case "localcandidate":
                  map.set(id, createRTCIceCandidateStats(report, false));
                  break;
                case "remotecandidate":
                  map.set(id, createRTCIceCandidateStats(report, true));
                  break;
                case "ssrc":
                  if (isPresent(report, "packetsReceived")) {
                    map.set(
                      "rtp-" + id,
                      createRTCInboundRTPStreamStats(report)
                    );
                  } else {
                    map.set(
                      "rtp-" + id,
                      createRTCOutboundRTPStreamStats(report)
                    );
                  }
                  map.set(
                    "track-" + id,
                    createRTCMediaStreamTrackStats(report)
                  );
                  map.set("codec-" + id, createRTCCodecStats(report));
                  break;
                case "googComponent":
                  var transportReport = createRTCTransportStats(report);
                  transportIds.set(transportReport.selectedCandidatePairId, id);
                  map.set(id, createRTCTransportStats(report));
                  break;
              }
              return map;
            }, new Map());
            if (activeCandidatePairId) {
              var activeTransportId = transportIds.get(activeCandidatePairId);
              if (activeTransportId) {
                statsMap.get(activeTransportId).dtlsState = "connected";
              }
            }
            return new MockRTCStatsReport(statsMap);
          };
          function createRTCTransportStats(report) {
            return {
              type: "transport",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              bytesSent: undefined,
              bytesReceived: undefined,
              rtcpTransportStatsId: undefined,
              dtlsState: undefined,
              selectedCandidatePairId: report.stat("selectedCandidatePairId"),
              localCertificateId: report.stat("localCertificateId"),
              remoteCertificateId: report.stat("remoteCertificateId")
            };
          }
          function createRTCCodecStats(report) {
            return {
              type: "codec",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              payloadType: undefined,
              mimeType:
                report.stat("mediaType") + "/" + report.stat("googCodecName"),
              clockRate: undefined,
              channels: undefined,
              sdpFmtpLine: undefined,
              implementation: undefined
            };
          }
          function createRTCMediaStreamTrackStats(report) {
            return {
              type: "track",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              trackIdentifier: report.stat("googTrackId"),
              remoteSource: undefined,
              ended: undefined,
              kind: report.stat("mediaType"),
              detached: undefined,
              ssrcIds: undefined,
              frameWidth: isPresent(report, "googFrameWidthReceived")
                ? getInt(report, "googFrameWidthReceived")
                : getInt(report, "googFrameWidthSent"),
              frameHeight: isPresent(report, "googFrameHeightReceived")
                ? getInt(report, "googFrameHeightReceived")
                : getInt(report, "googFrameHeightSent"),
              framesPerSecond: undefined,
              framesSent: getInt(report, "framesEncoded"),
              framesReceived: undefined,
              framesDecoded: getInt(report, "framesDecoded"),
              framesDropped: undefined,
              framesCorrupted: undefined,
              partialFramesLost: undefined,
              fullFramesLost: undefined,
              audioLevel: isPresent(report, "audioOutputLevel")
                ? getInt(report, "audioOutputLevel") / OLD_MAX_VOLUME
                : (getInt(report, "audioInputLevel") || 0) / OLD_MAX_VOLUME,
              echoReturnLoss: getFloat(
                report,
                "googEchoCancellationReturnLoss"
              ),
              echoReturnLossEnhancement: getFloat(
                report,
                "googEchoCancellationReturnLossEnhancement"
              )
            };
          }
          function createRTCRTPStreamStats(report, isInbound) {
            return {
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              ssrc: report.stat("ssrc"),
              associateStatsId: undefined,
              isRemote: undefined,
              mediaType: report.stat("mediaType"),
              trackId: "track-" + report.id,
              transportId: report.stat("transportId"),
              codecId: "codec-" + report.id,
              firCount: isInbound ? getInt(report, "googFirsSent") : undefined,
              pliCount: isInbound
                ? getInt(report, "googPlisSent")
                : getInt(report, "googPlisReceived"),
              nackCount: isInbound
                ? getInt(report, "googNacksSent")
                : getInt(report, "googNacksReceived"),
              sliCount: undefined,
              qpSum: getInt(report, "qpSum")
            };
          }
          function createRTCInboundRTPStreamStats(report) {
            var rtp = createRTCRTPStreamStats(report, true);
            Object.assign(rtp, {
              type: "inbound-rtp",
              packetsReceived: getInt(report, "packetsReceived"),
              bytesReceived: getInt(report, "bytesReceived"),
              packetsLost: getInt(report, "packetsLost"),
              jitter: convertMsToSeconds(report.stat("googJitterReceived")),
              fractionLost: undefined,
              roundTripTime: convertMsToSeconds(report.stat("googRtt")),
              packetsDiscarded: undefined,
              packetsRepaired: undefined,
              burstPacketsLost: undefined,
              burstPacketsDiscarded: undefined,
              burstLossCount: undefined,
              burstDiscardCount: undefined,
              burstLossRate: undefined,
              burstDiscardRate: undefined,
              gapLossRate: undefined,
              gapDiscardRate: undefined,
              framesDecoded: getInt(report, "framesDecoded")
            });
            return rtp;
          }
          function createRTCOutboundRTPStreamStats(report) {
            var rtp = createRTCRTPStreamStats(report, false);
            Object.assign(rtp, {
              type: "outbound-rtp",
              remoteTimestamp: undefined,
              packetsSent: getInt(report, "packetsSent"),
              bytesSent: getInt(report, "bytesSent"),
              targetBitrate: undefined,
              framesEncoded: getInt(report, "framesEncoded")
            });
            return rtp;
          }
          function createRTCIceCandidateStats(report, isRemote) {
            return {
              type: isRemote ? "remote-candidate" : "local-candidate",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              transportId: undefined,
              isRemote: isRemote,
              ip: report.stat("ipAddress"),
              port: getInt(report, "portNumber"),
              protocol: report.stat("transport"),
              candidateType: translateCandidateType(
                report.stat("candidateType")
              ),
              priority: getFloat(report, "priority"),
              url: undefined,
              relayProtocol: undefined,
              deleted: undefined
            };
          }
          function createRTCIceCandidatePairStats(report) {
            return {
              type: "candidate-pair",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              transportId: report.stat("googChannelId"),
              localCandidateId: report.stat("localCandidateId"),
              remoteCandidateId: report.stat("remoteCandidateId"),
              state: undefined,
              priority: undefined,
              nominated: undefined,
              writable: getBoolean(report, "googWritable"),
              readable: undefined,
              bytesSent: getInt(report, "bytesSent"),
              bytesReceived: getInt(report, "bytesReceived"),
              lastPacketSentTimestamp: undefined,
              lastPacketReceivedTimestamp: undefined,
              totalRoundTripTime: undefined,
              currentRoundTripTime: convertMsToSeconds(report.stat("googRtt")),
              availableOutgoingBitrate: undefined,
              availableIncomingBitrate: undefined,
              requestsReceived: getInt(report, "requestsReceived"),
              requestsSent: getInt(report, "requestsSent"),
              responsesReceived: getInt(report, "responsesReceived"),
              responsesSent: getInt(report, "responsesSent"),
              retransmissionsReceived: undefined,
              retransmissionsSent: undefined,
              consentRequestsSent: getInt(report, "consentRequestsSent")
            };
          }
          function createRTCCertificateStats(report) {
            return {
              type: "certificate",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              fingerprint: report.stat("googFingerprint"),
              fingerprintAlgorithm: report.stat("googFingerprintAlgorithm"),
              base64Certificate: report.stat("googDerBase64"),
              issuerCertificateId: report.stat("googIssuerId")
            };
          }
          function createRTCDataChannelStats(report) {
            return {
              type: "data-channel",
              id: report.id,
              timestamp: Date.parse(report.timestamp),
              label: report.stat("label"),
              protocol: report.stat("protocol"),
              datachannelid: report.stat("datachannelid"),
              transportId: report.stat("transportId"),
              state: report.stat("state"),
              messagesSent: undefined,
              bytesSent: undefined,
              messagesReceived: undefined,
              bytesReceived: undefined
            };
          }
          function convertMsToSeconds(inMs) {
            return isNaN(inMs) || inMs === ""
              ? undefined
              : parseInt(inMs, 10) / 1e3;
          }
          function translateCandidateType(type) {
            switch (type) {
              case "peerreflexive":
                return "prflx";
              case "serverreflexive":
                return "srflx";
              case "host":
              case "relay":
              default:
                return type;
            }
          }
          function getInt(report, statName) {
            var stat = report.stat(statName);
            return isPresent(report, statName) ? parseInt(stat, 10) : undefined;
          }
          function getFloat(report, statName) {
            var stat = report.stat(statName);
            return isPresent(report, statName) ? parseFloat(stat) : undefined;
          }
          function getBoolean(report, statName) {
            var stat = report.stat(statName);
            return isPresent(report, statName)
              ? stat === "true" || stat === true
              : undefined;
          }
          function isPresent(report, statName) {
            var stat = report.stat(statName);
            return typeof stat !== "undefined" && stat !== "";
          }
          module.exports = MockRTCStatsReport;
        },
        {}
      ],
      18: [
        function(require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function() {
              var extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function(d, b) {
                    d.__proto__ = b;
                  }) ||
                function(d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          var __assign =
            (this && this.__assign) ||
            Object.assign ||
            function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
              }
              return t;
            };
          Object.defineProperty(exports, "__esModule", { value: true });
          var events_1 = require("events");
          var getRTCStats = require("./stats");
          var Mos = require("./mos");
          var SAMPLE_COUNT_METRICS = 5;
          var SAMPLE_COUNT_CLEAR = 0;
          var SAMPLE_COUNT_RAISE = 3;
          var SAMPLE_INTERVAL = 1e3;
          var WARNING_TIMEOUT = 5 * 1e3;
          var DEFAULT_THRESHOLDS = {
            bytesReceived: {
              clearCount: 2,
              min: 1,
              raiseCount: 3,
              sampleCount: 3
            },
            bytesSent: { clearCount: 2, min: 1, raiseCount: 3, sampleCount: 3 },
            jitter: { max: 30 },
            mos: { min: 3 },
            packetsLostFraction: { max: 1 },
            rtt: { max: 400 }
          };
          function countHigh(max, values) {
            return values.reduce(function(highCount, value) {
              return (highCount += value > max ? 1 : 0);
            }, 0);
          }
          function countLow(min, values) {
            return values.reduce(function(lowCount, value) {
              return (lowCount += value < min ? 1 : 0);
            }, 0);
          }
          var RTCMonitor = (function(_super) {
            __extends(RTCMonitor, _super);
            function RTCMonitor(options) {
              var _this = _super.call(this) || this;
              _this._activeWarnings = new Map();
              _this._currentStreaks = new Map();
              _this._sampleBuffer = [];
              _this._warningsEnabled = true;
              options = options || {};
              _this._getRTCStats = options.getRTCStats || getRTCStats;
              _this._mos = options.Mos || Mos;
              _this._peerConnection = options.peerConnection;
              _this._thresholds = __assign(
                {},
                DEFAULT_THRESHOLDS,
                options.thresholds
              );
              var thresholdSampleCounts = Object.values(_this._thresholds)
                .map(function(threshold) {
                  return threshold.sampleCount;
                })
                .filter(function(sampleCount) {
                  return !!sampleCount;
                });
              _this._maxSampleCount = Math.max.apply(
                Math,
                [SAMPLE_COUNT_METRICS].concat(thresholdSampleCounts)
              );
              if (_this._peerConnection) {
                _this.enable(_this._peerConnection);
              }
              return _this;
            }
            RTCMonitor.prototype.disable = function() {
              clearInterval(this._sampleInterval);
              delete this._sampleInterval;
              return this;
            };
            RTCMonitor.prototype.disableWarnings = function() {
              if (this._warningsEnabled) {
                this._activeWarnings.clear();
              }
              this._warningsEnabled = false;
              return this;
            };
            RTCMonitor.prototype.enable = function(peerConnection) {
              if (peerConnection) {
                if (
                  this._peerConnection &&
                  peerConnection !== this._peerConnection
                ) {
                  throw new Error(
                    "Attempted to replace an existing PeerConnection in RTCMonitor.enable"
                  );
                }
                this._peerConnection = peerConnection;
              }
              if (!this._peerConnection) {
                throw new Error(
                  "Can not enable RTCMonitor without a PeerConnection"
                );
              }
              this._sampleInterval =
                this._sampleInterval ||
                setInterval(this._fetchSample.bind(this), SAMPLE_INTERVAL);
              return this;
            };
            RTCMonitor.prototype.enableWarnings = function() {
              this._warningsEnabled = true;
              return this;
            };
            RTCMonitor.prototype._addSample = function(sample) {
              var samples = this._sampleBuffer;
              samples.push(sample);
              if (samples.length > this._maxSampleCount) {
                samples.splice(0, samples.length - this._maxSampleCount);
              }
            };
            RTCMonitor.prototype._clearWarning = function(
              statName,
              thresholdName,
              data
            ) {
              var warningId = statName + ":" + thresholdName;
              var activeWarning = this._activeWarnings.get(warningId);
              if (
                !activeWarning ||
                Date.now() - activeWarning.timeRaised < WARNING_TIMEOUT
              ) {
                return;
              }
              this._activeWarnings.delete(warningId);
              this.emit(
                "warning-cleared",
                __assign({}, data, {
                  name: statName,
                  threshold: {
                    name: thresholdName,
                    value: this._thresholds[statName][thresholdName]
                  }
                })
              );
            };
            RTCMonitor.prototype._createSample = function(
              stats,
              previousSample
            ) {
              var previousBytesSent =
                (previousSample && previousSample.totals.bytesSent) || 0;
              var previousBytesReceived =
                (previousSample && previousSample.totals.bytesReceived) || 0;
              var previousPacketsSent =
                (previousSample && previousSample.totals.packetsSent) || 0;
              var previousPacketsReceived =
                (previousSample && previousSample.totals.packetsReceived) || 0;
              var previousPacketsLost =
                (previousSample && previousSample.totals.packetsLost) || 0;
              var currentBytesSent = stats.bytesSent - previousBytesSent;
              var currentBytesReceived =
                stats.bytesReceived - previousBytesReceived;
              var currentPacketsSent = stats.packetsSent - previousPacketsSent;
              var currentPacketsReceived =
                stats.packetsReceived - previousPacketsReceived;
              var currentPacketsLost = stats.packetsLost - previousPacketsLost;
              var currentInboundPackets =
                currentPacketsReceived + currentPacketsLost;
              var currentPacketsLostFraction =
                currentInboundPackets > 0
                  ? (currentPacketsLost / currentInboundPackets) * 100
                  : 0;
              var totalInboundPackets =
                stats.packetsReceived + stats.packetsLost;
              var totalPacketsLostFraction =
                totalInboundPackets > 0
                  ? (stats.packetsLost / totalInboundPackets) * 100
                  : 100;
              var rttValue =
                typeof stats.rtt === "number" || !previousSample
                  ? stats.rtt
                  : previousSample.rtt;
              return {
                bytesReceived: currentBytesReceived,
                bytesSent: currentBytesSent,
                codecName: stats.codecName,
                jitter: stats.jitter,
                mos: this._mos.calculate(
                  rttValue,
                  stats.jitter,
                  previousSample && currentPacketsLostFraction
                ),
                packetsLost: currentPacketsLost,
                packetsLostFraction: currentPacketsLostFraction,
                packetsReceived: currentPacketsReceived,
                packetsSent: currentPacketsSent,
                rtt: rttValue,
                timestamp: stats.timestamp,
                totals: {
                  bytesReceived: stats.bytesReceived,
                  bytesSent: stats.bytesSent,
                  packetsLost: stats.packetsLost,
                  packetsLostFraction: totalPacketsLostFraction,
                  packetsReceived: stats.packetsReceived,
                  packetsSent: stats.packetsSent
                }
              };
            };
            RTCMonitor.prototype._fetchSample = function() {
              var _this = this;
              this._getSample()
                .then(function(sample) {
                  _this._addSample(sample);
                  _this._raiseWarnings();
                  _this.emit("sample", sample);
                })
                .catch(function(error) {
                  _this.disable();
                  _this.emit("error", error);
                });
            };
            RTCMonitor.prototype._getSample = function() {
              var _this = this;
              return this._getRTCStats(this._peerConnection).then(function(
                stats
              ) {
                var previousSample = null;
                if (_this._sampleBuffer.length) {
                  previousSample =
                    _this._sampleBuffer[_this._sampleBuffer.length - 1];
                }
                return _this._createSample(stats, previousSample);
              });
            };
            RTCMonitor.prototype._raiseWarning = function(
              statName,
              thresholdName,
              data
            ) {
              var warningId = statName + ":" + thresholdName;
              if (this._activeWarnings.has(warningId)) {
                return;
              }
              this._activeWarnings.set(warningId, { timeRaised: Date.now() });
              this.emit(
                "warning",
                __assign({}, data, {
                  name: statName,
                  threshold: {
                    name: thresholdName,
                    value: this._thresholds[statName][thresholdName]
                  }
                })
              );
            };
            RTCMonitor.prototype._raiseWarnings = function() {
              var _this = this;
              if (!this._warningsEnabled) {
                return;
              }
              Object.keys(this._thresholds).forEach(function(name) {
                return _this._raiseWarningsForStat(name);
              });
            };
            RTCMonitor.prototype._raiseWarningsForStat = function(statName) {
              var samples = this._sampleBuffer;
              var limits = this._thresholds[statName];
              var clearCount = limits.clearCount || SAMPLE_COUNT_CLEAR;
              var raiseCount = limits.raiseCount || SAMPLE_COUNT_RAISE;
              var sampleCount = limits.sampleCount || this._maxSampleCount;
              var relevantSamples = samples.slice(-sampleCount);
              var values = relevantSamples.map(function(sample) {
                return sample[statName];
              });
              var containsNull = values.some(function(value) {
                return typeof value === "undefined" || value === null;
              });
              if (containsNull) {
                return;
              }
              var count;
              if (typeof limits.max === "number") {
                count = countHigh(limits.max, values);
                if (count >= raiseCount) {
                  this._raiseWarning(statName, "max", {
                    values: values,
                    samples: relevantSamples
                  });
                } else if (count <= clearCount) {
                  this._clearWarning(statName, "max", {
                    values: values,
                    samples: relevantSamples
                  });
                }
              }
              if (typeof limits.min === "number") {
                count = countLow(limits.min, values);
                if (count >= raiseCount) {
                  this._raiseWarning(statName, "min", {
                    values: values,
                    samples: relevantSamples
                  });
                } else if (count <= clearCount) {
                  this._clearWarning(statName, "min", {
                    values: values,
                    samples: relevantSamples
                  });
                }
              }
              if (
                typeof limits.maxDuration === "number" &&
                samples.length > 1
              ) {
                relevantSamples = samples.slice(-2);
                var prevValue = relevantSamples[0][statName];
                var curValue = relevantSamples[1][statName];
                var prevStreak = this._currentStreaks.get(statName) || 0;
                var streak = prevValue === curValue ? prevStreak + 1 : 0;
                this._currentStreaks.set(statName, streak);
                if (streak >= limits.maxDuration) {
                  this._raiseWarning(statName, "maxDuration", {
                    value: streak
                  });
                } else if (streak === 0) {
                  this._clearWarning(statName, "maxDuration", {
                    value: prevStreak
                  });
                }
              }
            };
            return RTCMonitor;
          })(events_1.EventEmitter);
          exports.default = RTCMonitor;
        },
        { "./mos": 19, "./stats": 23, events: 42 }
      ],
      19: [
        function(require, module, exports) {
          "use strict";
          var rfactorConstants = { r0: 94.768, is: 1.42611 };
          function calcMos(rtt, jitter, fractionLost) {
            if (
              !isPositiveNumber(rtt) ||
              !isPositiveNumber(jitter) ||
              !isPositiveNumber(fractionLost)
            ) {
              return null;
            }
            var rFactor = calculateRFactor(rtt, jitter, fractionLost);
            var mos =
              1 +
              0.035 * rFactor +
              7e-6 * rFactor * (rFactor - 60) * (100 - rFactor);
            var isValid = mos >= 1 && mos < 4.6;
            return isValid ? mos : null;
          }
          function calculateRFactor(rtt, jitter, fractionLost) {
            var effectiveLatency = rtt + jitter * 2 + 10;
            var rFactor = 0;
            switch (true) {
              case effectiveLatency < 160:
                rFactor = rfactorConstants.r0 - effectiveLatency / 40;
                break;
              case effectiveLatency < 1e3:
                rFactor = rfactorConstants.r0 - (effectiveLatency - 120) / 10;
                break;
              case effectiveLatency >= 1e3:
                rFactor = rfactorConstants.r0 - effectiveLatency / 100;
                break;
            }
            var multiplier = 0.01;
            switch (true) {
              case fractionLost === -1:
                multiplier = 0;
                rFactor = 0;
                break;
              case fractionLost <= rFactor / 2.5:
                multiplier = 2.5;
                break;
              case fractionLost > rFactor / 2.5 && fractionLost < 100:
                multiplier = 0.25;
                break;
            }
            rFactor -= fractionLost * multiplier;
            return rFactor;
          }
          function isPositiveNumber(n) {
            return typeof n === "number" && !isNaN(n) && isFinite(n) && n >= 0;
          }
          module.exports = { calculate: calcMos };
        },
        {}
      ],
      20: [
        function(require, module, exports) {
          "use strict";
          var Log = require("../log");
          var util = require("../util");
          var RTCPC = require("./rtcpc");
          var INITIAL_ICE_CONNECTION_STATE = "new";
          function PeerConnection(audioHelper, pstream, getUserMedia, options) {
            if (!audioHelper || !pstream || !getUserMedia) {
              throw new Error(
                "Audiohelper, pstream and getUserMedia are required arguments"
              );
            }
            if (!(this instanceof PeerConnection)) {
              return new PeerConnection(
                audioHelper,
                pstream,
                getUserMedia,
                options
              );
            }
            function noop() {}
            this.onopen = noop;
            this.onerror = noop;
            this.onclose = noop;
            this.ondisconnect = noop;
            this.onreconnect = noop;
            this.onsignalingstatechange = noop;
            this.oniceconnectionstatechange = noop;
            this.onicegatheringstatechange = noop;
            this.onicecandidate = noop;
            this.onvolume = noop;
            this.version = null;
            this.pstream = pstream;
            this.stream = null;
            this.sinkIds = new Set(["default"]);
            this.outputs = new Map();
            this.status = "connecting";
            this.callSid = null;
            this.isMuted = false;
            this.getUserMedia = getUserMedia;
            var AudioContext =
              typeof window !== "undefined" &&
              (window.AudioContext || window.webkitAudioContext);
            this._isSinkSupported =
              !!AudioContext &&
              typeof HTMLAudioElement !== "undefined" &&
              HTMLAudioElement.prototype.setSinkId;
            this._audioContext = AudioContext && audioHelper._audioContext;
            this._masterAudio = null;
            this._masterAudioDeviceId = null;
            this._mediaStreamSource = null;
            this._dtmfSender = null;
            this._dtmfSenderUnsupported = false;
            this._callEvents = [];
            this._nextTimeToPublish = Date.now();
            this._onAnswerOrRinging = noop;
            this._onHangup = noop;
            this._remoteStream = null;
            this._shouldManageStream = true;
            Log.mixinLog(this, "[Twilio.PeerConnection]");
            this.log.enabled = options.debug;
            this.log.warnings = options.warnings;
            this._iceState = INITIAL_ICE_CONNECTION_STATE;
            this._isUnifiedPlan = options.isUnifiedPlan;
            this.options = options = options || {};
            this.navigator =
              options.navigator ||
              (typeof navigator !== "undefined" ? navigator : null);
            this.util = options.util || util;
            this.codecPreferences = options.codecPreferences;
            return this;
          }
          PeerConnection.prototype.uri = function() {
            return this._uri;
          };
          PeerConnection.prototype.openWithConstraints = function(constraints) {
            return this.getUserMedia({ audio: constraints }).then(
              this._setInputTracksFromStream.bind(this, false)
            );
          };
          PeerConnection.prototype.setInputTracksFromStream = function(stream) {
            var self = this;
            return this._setInputTracksFromStream(true, stream).then(
              function() {
                self._shouldManageStream = false;
              }
            );
          };
          PeerConnection.prototype._createAnalyser = function(
            audioContext,
            options
          ) {
            options = Object.assign(
              { fftSize: 32, smoothingTimeConstant: 0.3 },
              options
            );
            var analyser = audioContext.createAnalyser();
            for (var field in options) {
              analyser[field] = options[field];
            }
            return analyser;
          };
          PeerConnection.prototype._setVolumeHandler = function(handler) {
            this.onvolume = handler;
          };
          PeerConnection.prototype._startPollingVolume = function() {
            if (!this._audioContext || !this.stream || !this._remoteStream) {
              return;
            }
            var audioContext = this._audioContext;
            var inputAnalyser = (this._inputAnalyser = this._createAnalyser(
              audioContext
            ));
            var inputBufferLength = inputAnalyser.frequencyBinCount;
            var inputDataArray = new Uint8Array(inputBufferLength);
            this._inputAnalyser2 = this._createAnalyser(audioContext, {
              minDecibels: -127,
              maxDecibels: 0,
              smoothingTimeConstant: 0
            });
            var outputAnalyser = (this._outputAnalyser = this._createAnalyser(
              audioContext
            ));
            var outputBufferLength = outputAnalyser.frequencyBinCount;
            var outputDataArray = new Uint8Array(outputBufferLength);
            this._outputAnalyser2 = this._createAnalyser(audioContext, {
              minDecibels: -127,
              maxDecibels: 0,
              smoothingTimeConstant: 0
            });
            this._updateInputStreamSource(this.stream);
            this._updateOutputStreamSource(this._remoteStream);
            var self = this;
            requestAnimationFrame(function emitVolume() {
              if (!self._audioContext) {
                return;
              } else if (self.status === "closed") {
                self._inputAnalyser.disconnect();
                self._outputAnalyser.disconnect();
                self._inputAnalyser2.disconnect();
                self._outputAnalyser2.disconnect();
                return;
              }
              self._inputAnalyser.getByteFrequencyData(inputDataArray);
              var inputVolume = self.util.average(inputDataArray);
              self._inputAnalyser2.getByteFrequencyData(inputDataArray);
              var inputVolume2 = self.util.average(inputDataArray);
              self._outputAnalyser.getByteFrequencyData(outputDataArray);
              var outputVolume = self.util.average(outputDataArray);
              self._outputAnalyser2.getByteFrequencyData(outputDataArray);
              var outputVolume2 = self.util.average(outputDataArray);
              self.onvolume(
                inputVolume / 255,
                outputVolume / 255,
                inputVolume2,
                outputVolume2
              );
              requestAnimationFrame(emitVolume);
            });
          };
          PeerConnection.prototype._stopStream = function _stopStream(stream) {
            if (!this._shouldManageStream) {
              return;
            }
            if (typeof MediaStreamTrack.prototype.stop === "function") {
              var audioTracks =
                typeof stream.getAudioTracks === "function"
                  ? stream.getAudioTracks()
                  : stream.audioTracks;
              audioTracks.forEach(function(track) {
                track.stop();
              });
            } else {
              stream.stop();
            }
          };
          PeerConnection.prototype._updateInputStreamSource = function(stream) {
            if (this._inputStreamSource) {
              this._inputStreamSource.disconnect();
            }
            this._inputStreamSource = this._audioContext.createMediaStreamSource(
              stream
            );
            this._inputStreamSource.connect(this._inputAnalyser);
            this._inputStreamSource.connect(this._inputAnalyser2);
          };
          PeerConnection.prototype._updateOutputStreamSource = function(
            stream
          ) {
            if (this._outputStreamSource) {
              this._outputStreamSource.disconnect();
            }
            this._outputStreamSource = this._audioContext.createMediaStreamSource(
              stream
            );
            this._outputStreamSource.connect(this._outputAnalyser);
            this._outputStreamSource.connect(this._outputAnalyser2);
          };
          PeerConnection.prototype._setInputTracksFromStream = function(
            shouldClone,
            newStream
          ) {
            return this._isUnifiedPlan
              ? this._setInputTracksForUnifiedPlan(shouldClone, newStream)
              : this._setInputTracksForPlanB(shouldClone, newStream);
          };
          PeerConnection.prototype._setInputTracksForPlanB = function(
            shouldClone,
            newStream
          ) {
            var _this = this;
            if (!newStream) {
              return Promise.reject(
                new Error("Can not set input stream to null while in a call")
              );
            }
            if (!newStream.getAudioTracks().length) {
              return Promise.reject(
                new Error("Supplied input stream has no audio tracks")
              );
            }
            var localStream = this.stream;
            if (!localStream) {
              this.stream = shouldClone ? cloneStream(newStream) : newStream;
            } else {
              this._stopStream(localStream);
              removeStream(this.version.pc, localStream);
              localStream
                .getAudioTracks()
                .forEach(localStream.removeTrack, localStream);
              newStream
                .getAudioTracks()
                .forEach(localStream.addTrack, localStream);
              addStream(this.version.pc, newStream);
              this._updateInputStreamSource(this.stream);
            }
            this.mute(this.isMuted);
            if (!this.version) {
              return Promise.resolve(this.stream);
            }
            return new Promise(function(resolve, reject) {
              _this.version.createOffer(
                _this.codecPreferences,
                { audio: true },
                function() {
                  _this.version.processAnswer(
                    _this.codecPreferences,
                    _this._answerSdp,
                    function() {
                      resolve(_this.stream);
                    },
                    reject
                  );
                },
                reject
              );
            });
          };
          PeerConnection.prototype._setInputTracksForUnifiedPlan = function(
            shouldClone,
            newStream
          ) {
            var _this2 = this;
            if (!newStream) {
              return Promise.reject(
                new Error("Can not set input stream to null while in a call")
              );
            }
            if (!newStream.getAudioTracks().length) {
              return Promise.reject(
                new Error("Supplied input stream has no audio tracks")
              );
            }
            var localStream = this.stream;
            var getStreamPromise = function getStreamPromise() {
              _this2.mute(_this2.isMuted);
              return Promise.resolve(_this2.stream);
            };
            if (!localStream) {
              this.stream = shouldClone ? cloneStream(newStream) : newStream;
            } else {
              if (this._shouldManageStream) {
                this._stopStream(localStream);
              }
              if (!this._sender) {
                this._sender = this.version.pc.getSenders()[0];
              }
              return this._sender
                .replaceTrack(newStream.getAudioTracks()[0])
                .then(function() {
                  _this2._updateInputStreamSource(newStream);
                  return getStreamPromise();
                });
            }
            return getStreamPromise();
          };
          PeerConnection.prototype._onInputDevicesChanged = function() {
            if (!this.stream) {
              return;
            }
            var activeInputWasLost = this.stream
              .getAudioTracks()
              .every(function(track) {
                return track.readyState === "ended";
              });
            if (activeInputWasLost && this._shouldManageStream) {
              this.openWithConstraints(true);
            }
          };
          PeerConnection.prototype._setSinkIds = function(sinkIds) {
            if (!this._isSinkSupported) {
              return Promise.reject(
                new Error(
                  "Audio output selection is not supported by this browser"
                )
              );
            }
            this.sinkIds = new Set(sinkIds.forEach ? sinkIds : [sinkIds]);
            return this.version
              ? this._updateAudioOutputs()
              : Promise.resolve();
          };
          PeerConnection.prototype._updateAudioOutputs = function updateAudioOutputs() {
            var addedOutputIds = Array.from(this.sinkIds).filter(function(id) {
              return !this.outputs.has(id);
            }, this);
            var removedOutputIds = Array.from(this.outputs.keys()).filter(
              function(id) {
                return !this.sinkIds.has(id);
              },
              this
            );
            var self = this;
            var createOutputPromises = addedOutputIds.map(
              this._createAudioOutput,
              this
            );
            return Promise.all(createOutputPromises).then(function() {
              return Promise.all(
                removedOutputIds.map(self._removeAudioOutput, self)
              );
            });
          };
          PeerConnection.prototype._createAudio = function createAudio(arr) {
            return new Audio(arr);
          };
          PeerConnection.prototype._createAudioOutput = function createAudioOutput(
            id
          ) {
            var dest = this._audioContext.createMediaStreamDestination();
            this._mediaStreamSource.connect(dest);
            var audio = this._createAudio();
            setAudioSource(audio, dest.stream);
            var self = this;
            return audio
              .setSinkId(id)
              .then(function() {
                return audio.play();
              })
              .then(function() {
                self.outputs.set(id, { audio: audio, dest: dest });
              });
          };
          PeerConnection.prototype._removeAudioOutputs = function removeAudioOutputs() {
            if (
              this._masterAudio &&
              typeof this._masterAudioDeviceId !== "undefined"
            ) {
              this._disableOutput(this, this._masterAudioDeviceId);
              this.outputs.delete(this._masterAudioDeviceId);
              this._masterAudioDeviceId = null;
              if (!this._masterAudio.paused) {
                this._masterAudio.pause();
              }
              if (typeof this._masterAudio.srcObject !== "undefined") {
                this._masterAudio.srcObject = null;
              } else {
                this._masterAudio.src = "";
              }
              this._masterAudio = null;
            }
            return Array.from(this.outputs.keys()).map(
              this._removeAudioOutput,
              this
            );
          };
          PeerConnection.prototype._disableOutput = function disableOutput(
            pc,
            id
          ) {
            var output = pc.outputs.get(id);
            if (!output) {
              return;
            }
            if (output.audio) {
              output.audio.pause();
              output.audio.src = "";
            }
            if (output.dest) {
              output.dest.disconnect();
            }
          };
          PeerConnection.prototype._reassignMasterOutput = function reassignMasterOutput(
            pc,
            masterId
          ) {
            var masterOutput = pc.outputs.get(masterId);
            pc.outputs.delete(masterId);
            var self = this;
            var idToReplace = Array.from(pc.outputs.keys())[0] || "default";
            return masterOutput.audio
              .setSinkId(idToReplace)
              .then(function() {
                self._disableOutput(pc, idToReplace);
                pc.outputs.set(idToReplace, masterOutput);
                pc._masterAudioDeviceId = idToReplace;
              })
              .catch(function rollback() {
                pc.outputs.set(masterId, masterOutput);
                self.log(
                  "Could not reassign master output. Attempted to roll back."
                );
              });
          };
          PeerConnection.prototype._removeAudioOutput = function removeAudioOutput(
            id
          ) {
            if (this._masterAudioDeviceId === id) {
              return this._reassignMasterOutput(this, id);
            }
            this._disableOutput(this, id);
            this.outputs.delete(id);
            return Promise.resolve();
          };
          PeerConnection.prototype._onAddTrack = function onAddTrack(
            pc,
            stream
          ) {
            var audio = (pc._masterAudio = this._createAudio());
            setAudioSource(audio, stream);
            audio.play();
            var deviceId = Array.from(pc.outputs.keys())[0] || "default";
            pc._masterAudioDeviceId = deviceId;
            pc.outputs.set(deviceId, { audio: audio });
            pc._mediaStreamSource = pc._audioContext.createMediaStreamSource(
              stream
            );
            pc.pcStream = stream;
            pc._updateAudioOutputs();
          };
          PeerConnection.prototype._fallbackOnAddTrack = function fallbackOnAddTrack(
            pc,
            stream
          ) {
            var audio = document && document.createElement("audio");
            audio.autoplay = true;
            if (!setAudioSource(audio, stream)) {
              pc.log("Error attaching stream to element.");
            }
            pc.outputs.set("default", { audio: audio });
          };
          PeerConnection.prototype._setNetworkPriority = function(priority) {
            if (
              !this.options ||
              !this.options.dscp ||
              !this._sender ||
              typeof this._sender.getParameters !== "function" ||
              typeof this._sender.setParameters !== "function"
            ) {
              return;
            }
            var params = this._sender.getParameters();
            if (
              !params.priority &&
              !(params.encodings && params.encodings.length)
            ) {
              return;
            }
            params.priority = priority;
            if (params.encodings && params.encodings.length) {
              params.encodings.forEach(function(encoding) {
                encoding.priority = priority;
                encoding.networkPriority = priority;
              });
            }
            this._sender.setParameters(params);
          };
          PeerConnection.prototype._setupPeerConnection = function(
            rtcConstraints,
            rtcConfiguration
          ) {
            var _this3 = this;
            var self = this;
            var version = this._getProtocol();
            version.create(this.log, rtcConstraints, rtcConfiguration);
            addStream(version.pc, this.stream);
            var eventName = "ontrack" in version.pc ? "ontrack" : "onaddstream";
            version.pc[eventName] = function(event) {
              var stream = (self._remoteStream =
                event.stream || event.streams[0]);
              if (typeof version.pc.getSenders === "function") {
                _this3._sender = version.pc.getSenders()[0];
              }
              if (self._isSinkSupported) {
                self._onAddTrack(self, stream);
              } else {
                self._fallbackOnAddTrack(self, stream);
              }
              self._startPollingVolume();
            };
            return version;
          };
          PeerConnection.prototype._setupChannel = function() {
            var _this4 = this;
            var pc = this.version.pc;
            this.version.pc.onopen = function() {
              _this4.status = "open";
              _this4.onopen();
            };
            this.version.pc.onstatechange = function() {
              if (
                _this4.version.pc &&
                _this4.version.pc.readyState === "stable"
              ) {
                _this4.status = "open";
                _this4.onopen();
              }
            };
            this.version.pc.onsignalingstatechange = function() {
              var state = pc.signalingState;
              _this4.log('signalingState is "' + state + '"');
              if (
                _this4.version.pc &&
                _this4.version.pc.signalingState === "stable"
              ) {
                _this4.status = "open";
                _this4.onopen();
              }
              _this4.onsignalingstatechange(pc.signalingState);
            };
            pc.onicecandidate = function(event) {
              _this4.onicecandidate(event.candidate);
            };
            pc.onicegatheringstatechange = function() {
              _this4.onicegatheringstatechange(pc.iceGatheringState);
            };
            pc.oniceconnectionstatechange = function() {
              var state = pc.iceConnectionState;
              var previousState = _this4._iceState;
              _this4._iceState = state;
              var message = void 0;
              switch (state) {
                case "connected":
                  if (previousState === "disconnected") {
                    message =
                      "ICE liveliness check succeeded. Connection with Twilio restored";
                    _this4.log(message);
                    _this4.onreconnect(message);
                  }
                  break;
                case "disconnected":
                  message =
                    "ICE liveliness check failed. May be having trouble connecting to Twilio";
                  _this4.log(message);
                  _this4.ondisconnect(message);
                  break;
                case "failed":
                  message =
                    previousState === "checking"
                      ? "ICE negotiation with Twilio failed."
                      : "Connection with Twilio was interrupted.";
                  _this4.log(message);
                  _this4.onerror({
                    info: { code: 31003, message: message },
                    disconnect: !_this4.options.enableIceRestart
                  });
                  break;
                default:
                  _this4.log('iceConnectionState is "' + state + '"');
              }
              _this4.oniceconnectionstatechange(state);
            };
          };
          PeerConnection.prototype._initializeMediaStream = function(
            rtcConstraints,
            rtcConfiguration
          ) {
            if (this.status === "open") {
              return false;
            }
            if (this.pstream.status === "disconnected") {
              this.onerror({
                info: {
                  code: 31e3,
                  message: "Cannot establish connection. Client is disconnected"
                }
              });
              this.close();
              return false;
            }
            this.version = this._setupPeerConnection(
              rtcConstraints,
              rtcConfiguration
            );
            this._setupChannel();
            return true;
          };
          PeerConnection.prototype._removeReconnectionListeners = function() {
            if (this.pstream) {
              this.pstream.removeListener("answer", this._onAnswerOrRinging);
              this.pstream.removeListener("hangup", this._onHangup);
            }
          };
          PeerConnection.prototype.iceRestart = function() {
            var _this5 = this;
            if (!this.options.enableIceRestart) {
              return Promise.reject(false);
            }
            return new Promise(function(resolve, reject) {
              _this5.log("Attempting to restart ICE...");
              _this5.version
                .createOffer(_this5.codecPreferences, { iceRestart: true })
                .then(
                  function() {
                    _this5._removeReconnectionListeners();
                    _this5._onAnswerOrRinging = function(payload) {
                      _this5._removeReconnectionListeners();
                      if (!payload.sdp) {
                        return reject(true);
                      }
                      if (
                        _this5.version.pc.signalingState !== "have-local-offer"
                      ) {
                        return reject(false);
                      }
                      _this5._answerSdp = payload.sdp;
                      if (_this5.status !== "closed") {
                        return _this5.version.processAnswer(
                          _this5.codecPreferences,
                          payload.sdp,
                          resolve,
                          function(err) {
                            var errMsg = err.message || err;
                            _this5.onerror({
                              info: {
                                code: 31e3,
                                message:
                                  "Error processing answer to re-invite: " +
                                  errMsg
                              }
                            });
                            reject(true);
                          }
                        );
                      }
                      return reject(true);
                    };
                    _this5._onHangup = function() {
                      _this5._removeReconnectionListeners();
                      reject(false);
                    };
                    _this5.pstream.on("answer", _this5._onAnswerOrRinging);
                    _this5.pstream.on("hangup", _this5._onHangup);
                    _this5.pstream.reinvite(
                      _this5.version.getSDP(),
                      _this5.callSid
                    );
                  },
                  function() {
                    return reject(true);
                  }
                );
            });
          };
          PeerConnection.prototype.makeOutgoingCall = function(
            token,
            params,
            callsid,
            rtcConstraints,
            rtcConfiguration,
            onMediaStarted
          ) {
            var _this6 = this;
            if (
              !this._initializeMediaStream(rtcConstraints, rtcConfiguration)
            ) {
              return;
            }
            var self = this;
            this.callSid = callsid;
            function onAnswerSuccess() {
              self._setNetworkPriority("high");
              onMediaStarted(self.version.pc);
            }
            function onAnswerError(err) {
              var errMsg = err.message || err;
              self.onerror({
                info: {
                  code: 31e3,
                  message: "Error processing answer: " + errMsg
                }
              });
            }
            this._onAnswerOrRinging = function(payload) {
              if (!payload.sdp) {
                return;
              }
              self._answerSdp = payload.sdp;
              if (self.status !== "closed") {
                self.version.processAnswer(
                  _this6.codecPreferences,
                  payload.sdp,
                  onAnswerSuccess,
                  onAnswerError
                );
              }
              self.pstream.removeListener("answer", self._onAnswerOrRinging);
              self.pstream.removeListener("ringing", self._onAnswerOrRinging);
            };
            this.pstream.on("answer", this._onAnswerOrRinging);
            this.pstream.on("ringing", this._onAnswerOrRinging);
            function onOfferSuccess() {
              if (self.status !== "closed") {
                self.pstream.publish("invite", {
                  sdp: self.version.getSDP(),
                  callsid: self.callSid,
                  twilio: params ? { params: params } : {}
                });
              }
            }
            function onOfferError(err) {
              var errMsg = err.message || err;
              self.onerror({
                info: {
                  code: 31e3,
                  message: "Error creating the offer: " + errMsg
                }
              });
            }
            this.version.createOffer(
              this.codecPreferences,
              { audio: true },
              onOfferSuccess,
              onOfferError
            );
          };
          PeerConnection.prototype.answerIncomingCall = function(
            callSid,
            sdp,
            rtcConstraints,
            rtcConfiguration,
            onMediaStarted
          ) {
            if (
              !this._initializeMediaStream(rtcConstraints, rtcConfiguration)
            ) {
              return;
            }
            this._answerSdp = sdp.replace(
              /^a=setup:actpass$/gm,
              "a=setup:passive"
            );
            this.callSid = callSid;
            var self = this;
            function onAnswerSuccess() {
              if (self.status !== "closed") {
                self.pstream.publish("answer", {
                  callsid: callSid,
                  sdp: self.version.getSDP()
                });
                self._setNetworkPriority("high");
                onMediaStarted(self.version.pc);
              }
            }
            function onAnswerError(err) {
              var errMsg = err.message || err;
              self.onerror({
                info: {
                  code: 31e3,
                  message: "Error creating the answer: " + errMsg
                }
              });
            }
            this.version.processSDP(
              this.codecPreferences,
              sdp,
              { audio: true },
              onAnswerSuccess,
              onAnswerError
            );
          };
          PeerConnection.prototype.close = function() {
            if (this.version && this.version.pc) {
              if (this.version.pc.signalingState !== "closed") {
                this.version.pc.close();
              }
              this.version.pc = null;
            }
            if (this.stream) {
              this.mute(false);
              this._stopStream(this.stream);
            }
            this.stream = null;
            this._removeReconnectionListeners();
            Promise.all(this._removeAudioOutputs()).catch(function() {});
            if (this._mediaStreamSource) {
              this._mediaStreamSource.disconnect();
            }
            if (this._inputAnalyser) {
              this._inputAnalyser.disconnect();
            }
            if (this._outputAnalyser) {
              this._outputAnalyser.disconnect();
            }
            if (this._inputAnalyser2) {
              this._inputAnalyser2.disconnect();
            }
            if (this._outputAnalyser2) {
              this._outputAnalyser2.disconnect();
            }
            this.status = "closed";
            this.onclose();
          };
          PeerConnection.prototype.reject = function(callSid) {
            this.callSid = callSid;
          };
          PeerConnection.prototype.ignore = function(callSid) {
            this.callSid = callSid;
          };
          PeerConnection.prototype.mute = function(shouldMute) {
            this.isMuted = shouldMute;
            if (!this.stream) {
              return;
            }
            if (this._sender && this._sender.track) {
              this._sender.track.enabled = !shouldMute;
            } else {
              var audioTracks =
                typeof this.stream.getAudioTracks === "function"
                  ? this.stream.getAudioTracks()
                  : this.stream.audioTracks;
              audioTracks.forEach(function(track) {
                track.enabled = !shouldMute;
              });
            }
          };
          PeerConnection.prototype.getOrCreateDTMFSender = function getOrCreateDTMFSender() {
            if (this._dtmfSender || this._dtmfSenderUnsupported) {
              return this._dtmfSender || null;
            }
            var self = this;
            var pc = this.version.pc;
            if (!pc) {
              this.log(
                "No RTCPeerConnection available to call createDTMFSender on"
              );
              return null;
            }
            if (
              typeof pc.getSenders === "function" &&
              (typeof RTCDTMFSender === "function" ||
                typeof RTCDtmfSender === "function")
            ) {
              var chosenSender = pc.getSenders().find(function(sender) {
                return sender.dtmf;
              });
              if (chosenSender) {
                this.log("Using RTCRtpSender#dtmf");
                this._dtmfSender = chosenSender.dtmf;
                return this._dtmfSender;
              }
            }
            if (
              typeof pc.createDTMFSender === "function" &&
              typeof pc.getLocalStreams === "function"
            ) {
              var track = pc.getLocalStreams().map(function(stream) {
                var tracks = self._getAudioTracks(stream);
                return tracks && tracks[0];
              })[0];
              if (!track) {
                this.log(
                  "No local audio MediaStreamTrack available on the RTCPeerConnection to pass to createDTMFSender"
                );
                return null;
              }
              this.log("Creating RTCDTMFSender");
              this._dtmfSender = pc.createDTMFSender(track);
              return this._dtmfSender;
            }
            this.log("RTCPeerConnection does not support RTCDTMFSender");
            this._dtmfSenderUnsupported = true;
            return null;
          };
          PeerConnection.prototype._canStopMediaStreamTrack = function() {
            return typeof MediaStreamTrack.prototype.stop === "function";
          };
          PeerConnection.prototype._getAudioTracks = function(stream) {
            return typeof stream.getAudioTracks === "function"
              ? stream.getAudioTracks()
              : stream.audioTracks;
          };
          PeerConnection.prototype._getProtocol = function() {
            return PeerConnection.protocol;
          };
          PeerConnection.protocol = (function() {
            return RTCPC.test() ? new RTCPC() : null;
          })();
          function addStream(pc, stream) {
            if (typeof pc.addTrack === "function") {
              stream.getAudioTracks().forEach(function(track) {
                pc.addTrack(track, stream);
              });
            } else {
              pc.addStream(stream);
            }
          }
          function cloneStream(oldStream) {
            var newStream =
              typeof MediaStream !== "undefined"
                ? new MediaStream()
                : new webkitMediaStream();
            oldStream.getAudioTracks().forEach(newStream.addTrack, newStream);
            return newStream;
          }
          function removeStream(pc, stream) {
            if (typeof pc.removeTrack === "function") {
              pc.getSenders().forEach(function(sender) {
                pc.removeTrack(sender);
              });
            } else {
              pc.removeStream(stream);
            }
          }
          function setAudioSource(audio, stream) {
            if (typeof audio.srcObject !== "undefined") {
              audio.srcObject = stream;
            } else if (typeof audio.mozSrcObject !== "undefined") {
              audio.mozSrcObject = stream;
            } else if (typeof audio.src !== "undefined") {
              var _window = audio.options.window || window;
              audio.src = (_window.URL || _window.webkitURL).createObjectURL(
                stream
              );
            } else {
              return false;
            }
            return true;
          }
          PeerConnection.enabled = !!PeerConnection.protocol;
          module.exports = PeerConnection;
        },
        { "../log": 10, "../util": 29, "./rtcpc": 21 }
      ],
      21: [
        function(require, module, exports) {
          (function(global) {
            "use strict";
            var _typeof =
              typeof Symbol === "function" &&
              typeof Symbol.iterator === "symbol"
                ? function(obj) {
                    return typeof obj;
                  }
                : function(obj) {
                    return obj &&
                      typeof Symbol === "function" &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? "symbol"
                      : typeof obj;
                  };
            var RTCPeerConnectionShim = require("rtcpeerconnection-shim");
            var _require = require("./sdp"),
              setCodecPreferences = _require.setCodecPreferences;
            var util = require("../util");
            function RTCPC() {
              if (typeof window === "undefined") {
                this.log(
                  "No RTCPeerConnection implementation available. The window object was not found."
                );
                return;
              }
              if (util.isEdge()) {
                this.RTCPeerConnection = new RTCPeerConnectionShim(
                  typeof window !== "undefined" ? window : global
                );
              } else if (typeof window.RTCPeerConnection === "function") {
                this.RTCPeerConnection = window.RTCPeerConnection;
              } else if (typeof window.webkitRTCPeerConnection === "function") {
                this.RTCPeerConnection = webkitRTCPeerConnection;
              } else if (typeof window.mozRTCPeerConnection === "function") {
                this.RTCPeerConnection = mozRTCPeerConnection;
                window.RTCSessionDescription = mozRTCSessionDescription;
                window.RTCIceCandidate = mozRTCIceCandidate;
              } else {
                this.log("No RTCPeerConnection implementation available");
              }
            }
            RTCPC.prototype.create = function(
              log,
              rtcConstraints,
              rtcConfiguration
            ) {
              this.log = log;
              this.pc = new this.RTCPeerConnection(
                rtcConfiguration,
                rtcConstraints
              );
            };
            RTCPC.prototype.createModernConstraints = function(c) {
              if (typeof c === "undefined") {
                return null;
              }
              var nc = Object.assign({}, c);
              if (
                typeof webkitRTCPeerConnection !== "undefined" &&
                !util.isEdge()
              ) {
                nc.mandatory = {};
                if (typeof c.audio !== "undefined") {
                  nc.mandatory.OfferToReceiveAudio = c.audio;
                }
                if (typeof c.video !== "undefined") {
                  nc.mandatory.OfferToReceiveVideo = c.video;
                }
              } else {
                if (typeof c.audio !== "undefined") {
                  nc.offerToReceiveAudio = c.audio;
                }
                if (typeof c.video !== "undefined") {
                  nc.offerToReceiveVideo = c.video;
                }
              }
              delete nc.audio;
              delete nc.video;
              return nc;
            };
            RTCPC.prototype.createOffer = function(
              codecPreferences,
              constraints,
              onSuccess,
              onError
            ) {
              var _this = this;
              constraints = this.createModernConstraints(constraints);
              return promisifyCreate(this.pc.createOffer, this.pc)(constraints)
                .then(function(offer) {
                  if (!_this.pc) {
                    return Promise.resolve();
                  }
                  return promisifySet(
                    _this.pc.setLocalDescription,
                    _this.pc
                  )(new RTCSessionDescription({ type: "offer", sdp: setCodecPreferences(offer.sdp, codecPreferences) }));
                })
                .then(onSuccess, onError);
            };
            RTCPC.prototype.createAnswer = function(
              codecPreferences,
              constraints,
              onSuccess,
              onError
            ) {
              var _this2 = this;
              constraints = this.createModernConstraints(constraints);
              return promisifyCreate(this.pc.createAnswer, this.pc)(constraints)
                .then(function(answer) {
                  if (!_this2.pc) {
                    return Promise.resolve();
                  }
                  return promisifySet(
                    _this2.pc.setLocalDescription,
                    _this2.pc
                  )(new RTCSessionDescription({ type: "answer", sdp: setCodecPreferences(answer.sdp, codecPreferences) }));
                })
                .then(onSuccess, onError);
            };
            RTCPC.prototype.processSDP = function(
              codecPreferences,
              sdp,
              constraints,
              onSuccess,
              onError
            ) {
              var _this3 = this;
              sdp = setCodecPreferences(sdp, codecPreferences);
              var desc = new RTCSessionDescription({ sdp: sdp, type: "offer" });
              return promisifySet(this.pc.setRemoteDescription, this.pc)(
                desc
              ).then(function() {
                _this3.createAnswer(
                  codecPreferences,
                  constraints,
                  onSuccess,
                  onError
                );
              });
            };
            RTCPC.prototype.getSDP = function() {
              return this.pc.localDescription.sdp;
            };
            RTCPC.prototype.processAnswer = function(
              codecPreferences,
              sdp,
              onSuccess,
              onError
            ) {
              if (!this.pc) {
                return Promise.resolve();
              }
              sdp = setCodecPreferences(sdp, codecPreferences);
              return promisifySet(this.pc.setRemoteDescription, this.pc)(
                new RTCSessionDescription({ sdp: sdp, type: "answer" })
              ).then(onSuccess, onError);
            };
            RTCPC.test = function() {
              if (
                (typeof navigator === "undefined"
                  ? "undefined"
                  : _typeof(navigator)) === "object"
              ) {
                var getUserMedia =
                  (navigator.mediaDevices &&
                    navigator.mediaDevices.getUserMedia) ||
                  navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia ||
                  navigator.getUserMedia;
                if (
                  getUserMedia &&
                  typeof window.RTCPeerConnection === "function"
                ) {
                  return true;
                } else if (
                  getUserMedia &&
                  typeof window.webkitRTCPeerConnection === "function"
                ) {
                  return true;
                } else if (
                  getUserMedia &&
                  typeof window.mozRTCPeerConnection === "function"
                ) {
                  try {
                    var test = new window.mozRTCPeerConnection();
                    if (typeof test.getLocalStreams !== "function")
                      return false;
                  } catch (e) {
                    return false;
                  }
                  return true;
                } else if (typeof RTCIceGatherer !== "undefined") {
                  return true;
                }
              }
              return false;
            };
            function promisify(fn, ctx, areCallbacksFirst) {
              return function() {
                var args = Array.prototype.slice.call(arguments);
                return new Promise(function(resolve) {
                  resolve(fn.apply(ctx, args));
                }).catch(function() {
                  return new Promise(function(resolve, reject) {
                    fn.apply(
                      ctx,
                      areCallbacksFirst
                        ? [resolve, reject].concat(args)
                        : args.concat([resolve, reject])
                    );
                  });
                });
              };
            }
            function promisifyCreate(fn, ctx) {
              return promisify(fn, ctx, true);
            }
            function promisifySet(fn, ctx) {
              return promisify(fn, ctx, false);
            }
            module.exports = RTCPC;
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        { "../util": 29, "./sdp": 22, "rtcpeerconnection-shim": 49 }
      ],
      22: [
        function(require, module, exports) {
          "use strict";
          var util = require("../util");
          var ptToFixedBitrateAudioCodecName = { 0: "PCMU", 8: "PCMA" };
          function setCodecPreferences(sdp, preferredCodecs) {
            var mediaSections = getMediaSections(sdp);
            var session = sdp.split("\r\nm=")[0];
            return [session]
              .concat(
                mediaSections.map(function(section) {
                  if (!/^m=(audio|video)/.test(section)) {
                    return section;
                  }
                  var kind = section.match(/^m=(audio|video)/)[1];
                  var codecMap = createCodecMapForMediaSection(section);
                  var payloadTypes = getReorderedPayloadTypes(
                    codecMap,
                    preferredCodecs
                  );
                  var newSection = setPayloadTypesInMediaSection(
                    payloadTypes,
                    section
                  );
                  var pcmaPayloadTypes = codecMap.get("pcma") || [];
                  var pcmuPayloadTypes = codecMap.get("pcmu") || [];
                  var fixedBitratePayloadTypes =
                    kind === "audio"
                      ? new Set(pcmaPayloadTypes.concat(pcmuPayloadTypes))
                      : new Set();
                  return fixedBitratePayloadTypes.has(payloadTypes[0])
                    ? newSection.replace(/\r\nb=(AS|TIAS):([0-9]+)/g, "")
                    : newSection;
                })
              )
              .join("\r\n");
          }
          function getMediaSections(sdp, kind, direction) {
            return sdp
              .replace(/\r\n\r\n$/, "\r\n")
              .split("\r\nm=")
              .slice(1)
              .map(function(mediaSection) {
                return "m=" + mediaSection;
              })
              .filter(function(mediaSection) {
                var kindPattern = new RegExp("m=" + (kind || ".*"), "gm");
                var directionPattern = new RegExp(
                  "a=" + (direction || ".*"),
                  "gm"
                );
                return (
                  kindPattern.test(mediaSection) &&
                  directionPattern.test(mediaSection)
                );
              });
          }
          function createCodecMapForMediaSection(section) {
            return Array.from(createPtToCodecName(section)).reduce(function(
              codecMap,
              pair
            ) {
              var pt = pair[0];
              var codecName = pair[1];
              var pts = codecMap.get(codecName) || [];
              return codecMap.set(codecName, pts.concat(pt));
            },
            new Map());
          }
          function getReorderedPayloadTypes(codecMap, preferredCodecs) {
            preferredCodecs = preferredCodecs.map(function(codecName) {
              return codecName.toLowerCase();
            });
            var preferredPayloadTypes = util.flatMap(preferredCodecs, function(
              codecName
            ) {
              return codecMap.get(codecName) || [];
            });
            var remainingCodecs = util.difference(
              Array.from(codecMap.keys()),
              preferredCodecs
            );
            var remainingPayloadTypes = util.flatMap(remainingCodecs, function(
              codecName
            ) {
              return codecMap.get(codecName);
            });
            return preferredPayloadTypes.concat(remainingPayloadTypes);
          }
          function setPayloadTypesInMediaSection(payloadTypes, section) {
            var lines = section.split("\r\n");
            var mLine = lines[0];
            var otherLines = lines.slice(1);
            mLine = mLine.replace(/([0-9]+\s?)+$/, payloadTypes.join(" "));
            return [mLine].concat(otherLines).join("\r\n");
          }
          function createPtToCodecName(mediaSection) {
            return getPayloadTypesInMediaSection(mediaSection).reduce(function(
              ptToCodecName,
              pt
            ) {
              var rtpmapPattern = new RegExp("a=rtpmap:" + pt + " ([^/]+)");
              var matches = mediaSection.match(rtpmapPattern);
              var codecName = matches
                ? matches[1].toLowerCase()
                : ptToFixedBitrateAudioCodecName[pt]
                ? ptToFixedBitrateAudioCodecName[pt].toLowerCase()
                : "";
              return ptToCodecName.set(pt, codecName);
            },
            new Map());
          }
          function getPayloadTypesInMediaSection(section) {
            var mLine = section.split("\r\n")[0];
            var matches = mLine.match(/([0-9]+)/g);
            if (!matches) {
              return [];
            }
            return matches.slice(1).map(function(match) {
              return parseInt(match, 10);
            });
          }
          module.exports = { setCodecPreferences: setCodecPreferences };
        },
        { "../util": 29 }
      ],
      23: [
        function(require, module, exports) {
          "use strict";
          var MockRTCStatsReport = require("./mockrtcstatsreport");
          var ERROR_PEER_CONNECTION_NULL = "PeerConnection is null";
          var ERROR_WEB_RTC_UNSUPPORTED = "WebRTC statistics are unsupported";
          function getStatistics(peerConnection, options) {
            options = Object.assign(
              { createRTCSample: createRTCSample },
              options
            );
            if (!peerConnection) {
              return Promise.reject(new Error(ERROR_PEER_CONNECTION_NULL));
            }
            if (typeof peerConnection.getStats !== "function") {
              return Promise.reject(new Error(ERROR_WEB_RTC_UNSUPPORTED));
            }
            var promise = void 0;
            try {
              promise = peerConnection.getStats();
            } catch (e) {
              promise = new Promise(function(resolve) {
                return peerConnection.getStats(resolve);
              }).then(MockRTCStatsReport.fromRTCStatsResponse);
            }
            return promise.then(options.createRTCSample);
          }
          function RTCSample() {}
          function createRTCSample(statsReport) {
            var activeTransportId = null;
            var sample = new RTCSample();
            var fallbackTimestamp = void 0;
            Array.from(statsReport.values()).forEach(function(stats) {
              if (stats.isRemote) {
                return;
              }
              var type = stats.type.replace("-", "");
              fallbackTimestamp = fallbackTimestamp || stats.timestamp;
              if (stats.remoteId) {
                var remote = statsReport.get(stats.remoteId);
                if (remote && remote.roundTripTime) {
                  sample.rtt = remote.roundTripTime;
                }
              }
              switch (type) {
                case "inboundrtp":
                  sample.timestamp = sample.timestamp || stats.timestamp;
                  sample.jitter = stats.jitter * 1e3;
                  sample.packetsLost = stats.packetsLost;
                  sample.packetsReceived = stats.packetsReceived;
                  sample.bytesReceived = stats.bytesReceived;
                  break;
                case "outboundrtp":
                  sample.timestamp = stats.timestamp;
                  sample.packetsSent = stats.packetsSent;
                  sample.bytesSent = stats.bytesSent;
                  if (stats.codecId) {
                    var codec = statsReport.get(stats.codecId);
                    sample.codecName = codec
                      ? codec.mimeType && codec.mimeType.match(/(.*\/)?(.*)/)[2]
                      : stats.codecId;
                  }
                  break;
                case "transport":
                  if (stats.dtlsState === "connected") {
                    activeTransportId = stats.id;
                  }
                  break;
              }
            });
            if (!sample.timestamp) {
              sample.timestamp = fallbackTimestamp;
            }
            var activeTransport = statsReport.get(activeTransportId);
            if (!activeTransport) {
              return sample;
            }
            var selectedCandidatePair = statsReport.get(
              activeTransport.selectedCandidatePairId
            );
            if (!selectedCandidatePair) {
              return sample;
            }
            var localCandidate = statsReport.get(
              selectedCandidatePair.localCandidateId
            );
            var remoteCandidate = statsReport.get(
              selectedCandidatePair.remoteCandidateId
            );
            if (!sample.rtt) {
              sample.rtt =
                selectedCandidatePair &&
                selectedCandidatePair.currentRoundTripTime * 1e3;
            }
            Object.assign(sample, {
              localAddress: localCandidate && localCandidate.ip,
              remoteAddress: remoteCandidate && remoteCandidate.ip
            });
            return sample;
          }
          module.exports = getStatistics;
        },
        { "./mockrtcstatsreport": 17 }
      ],
      24: [
        function(require, module, exports) {
          var EventEmitter = require("events").EventEmitter;
          function EventTarget() {
            Object.defineProperties(this, {
              _eventEmitter: { value: new EventEmitter() },
              _handlers: { value: {} }
            });
          }
          EventTarget.prototype.dispatchEvent = function dispatchEvent(event) {
            return this._eventEmitter.emit(event.type, event);
          };
          EventTarget.prototype.addEventListener = function addEventListener() {
            return (_a = this._eventEmitter).addListener.apply(_a, arguments);
            var _a;
          };
          EventTarget.prototype.removeEventListener = function removeEventListener() {
            return (_a = this._eventEmitter).removeListener.apply(
              _a,
              arguments
            );
            var _a;
          };
          EventTarget.prototype._defineEventHandler = function _defineEventHandler(
            eventName
          ) {
            var self = this;
            Object.defineProperty(this, "on" + eventName, {
              get: function() {
                return self._handlers[eventName];
              },
              set: function(newHandler) {
                var oldHandler = self._handlers[eventName];
                if (
                  oldHandler &&
                  (typeof newHandler === "function" ||
                    typeof newHandler === "undefined" ||
                    newHandler === null)
                ) {
                  self._handlers[eventName] = null;
                  self.removeEventListener(eventName, oldHandler);
                }
                if (typeof newHandler === "function") {
                  self._handlers[eventName] = newHandler;
                  self.addEventListener(eventName, newHandler);
                }
              }
            });
          };
          module.exports = EventTarget;
        },
        { events: 42 }
      ],
      25: [
        function(require, module, exports) {
          "use strict";
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var MediaDeviceInfoShim = function MediaDeviceInfoShim(options) {
            _classCallCheck(this, MediaDeviceInfoShim);
            Object.defineProperties(this, {
              deviceId: {
                get: function get() {
                  return options.deviceId;
                }
              },
              groupId: {
                get: function get() {
                  return options.groupId;
                }
              },
              kind: {
                get: function get() {
                  return options.kind;
                }
              },
              label: {
                get: function get() {
                  return options.label;
                }
              }
            });
          };
          module.exports = MediaDeviceInfoShim;
        },
        {}
      ],
      26: [
        function(require, module, exports) {
          var EventTarget = require("./eventtarget");
          var inherits = require("util").inherits;
          var POLL_INTERVAL_MS = 500;
          var nativeMediaDevices =
            typeof navigator !== "undefined" && navigator.mediaDevices;
          function MediaDevicesShim() {
            EventTarget.call(this);
            this._defineEventHandler("devicechange");
            this._defineEventHandler("deviceinfochange");
            var knownDevices = [];
            Object.defineProperties(this, {
              _deviceChangeIsNative: {
                value: reemitNativeEvent(this, "devicechange")
              },
              _deviceInfoChangeIsNative: {
                value: reemitNativeEvent(this, "deviceinfochange")
              },
              _knownDevices: { value: knownDevices },
              _pollInterval: { value: null, writable: true }
            });
            if (typeof nativeMediaDevices.enumerateDevices === "function") {
              nativeMediaDevices.enumerateDevices().then(function(devices) {
                devices.sort(sortDevicesById).forEach([].push, knownDevices);
              });
            }
            this._eventEmitter.on(
              "newListener",
              function maybeStartPolling(eventName) {
                if (
                  eventName !== "devicechange" &&
                  eventName !== "deviceinfochange"
                ) {
                  return;
                }
                this._pollInterval =
                  this._pollInterval ||
                  setInterval(sampleDevices.bind(null, this), POLL_INTERVAL_MS);
              }.bind(this)
            );
            this._eventEmitter.on(
              "removeListener",
              function maybeStopPolling() {
                if (this._pollInterval && !hasChangeListeners(this)) {
                  clearInterval(this._pollInterval);
                  this._pollInterval = null;
                }
              }.bind(this)
            );
          }
          inherits(MediaDevicesShim, EventTarget);
          if (
            nativeMediaDevices &&
            typeof nativeMediaDevices.enumerateDevices === "function"
          ) {
            MediaDevicesShim.prototype.enumerateDevices = function enumerateDevices() {
              return nativeMediaDevices.enumerateDevices.apply(
                nativeMediaDevices,
                arguments
              );
            };
          }
          MediaDevicesShim.prototype.getUserMedia = function getUserMedia() {
            return nativeMediaDevices.getUserMedia.apply(
              nativeMediaDevices,
              arguments
            );
          };
          function deviceInfosHaveChanged(newDevices, oldDevices) {
            var oldLabels = oldDevices.reduce(function(map, device) {
              return map.set(device.deviceId, device.label || null);
            }, new Map());
            return newDevices.some(function(newDevice) {
              var oldLabel = oldLabels.get(newDevice.deviceId);
              return (
                typeof oldLabel !== "undefined" && oldLabel !== newDevice.label
              );
            });
          }
          function devicesHaveChanged(newDevices, oldDevices) {
            return (
              newDevices.length !== oldDevices.length ||
              propertyHasChanged("deviceId", newDevices, oldDevices)
            );
          }
          function hasChangeListeners(mediaDevices) {
            return (
              ["devicechange", "deviceinfochange"].reduce(function(
                count,
                event
              ) {
                return count + mediaDevices._eventEmitter.listenerCount(event);
              },
              0) > 0
            );
          }
          function sampleDevices(mediaDevices) {
            nativeMediaDevices.enumerateDevices().then(function(newDevices) {
              var knownDevices = mediaDevices._knownDevices;
              var oldDevices = knownDevices.slice();
              [].splice.apply(
                knownDevices,
                [0, knownDevices.length].concat(
                  newDevices.sort(sortDevicesById)
                )
              );
              if (
                !mediaDevices._deviceChangeIsNative &&
                devicesHaveChanged(knownDevices, oldDevices)
              ) {
                mediaDevices.dispatchEvent(new Event("devicechange"));
              }
              if (
                !mediaDevices._deviceInfoChangeIsNative &&
                deviceInfosHaveChanged(knownDevices, oldDevices)
              ) {
                mediaDevices.dispatchEvent(new Event("deviceinfochange"));
              }
            });
          }
          function propertyHasChanged(propertyName, as, bs) {
            return as.some(function(a, i) {
              return a[propertyName] !== bs[i][propertyName];
            });
          }
          function reemitNativeEvent(mediaDevices, eventName) {
            var methodName = "on" + eventName;
            function dispatchEvent(event) {
              mediaDevices.dispatchEvent(event);
            }
            if (methodName in nativeMediaDevices) {
              if ("addEventListener" in nativeMediaDevices) {
                nativeMediaDevices.addEventListener(eventName, dispatchEvent);
              } else {
                nativeMediaDevices[methodName] = dispatchEvent;
              }
              return true;
            }
            return false;
          }
          function sortDevicesById(a, b) {
            return a.deviceId < b.deviceId;
          }
          module.exports = (function shimMediaDevices() {
            return nativeMediaDevices ? new MediaDevicesShim() : null;
          })();
        },
        { "./eventtarget": 24, util: 53 }
      ],
      27: [
        function(require, module, exports) {
          "use strict";
          var AudioPlayer = require("@twilio/audioplayer");
          function Sound(name, url, options) {
            if (!(this instanceof Sound)) {
              return new Sound(name, url, options);
            }
            if (!name || !url) {
              throw new Error("name and url are required arguments");
            }
            options = Object.assign(
              {
                AudioFactory: typeof Audio !== "undefined" ? Audio : null,
                maxDuration: 0,
                shouldLoop: false
              },
              options
            );
            options.AudioPlayer = options.audioContext
              ? AudioPlayer.bind(AudioPlayer, options.audioContext)
              : options.AudioFactory;
            Object.defineProperties(this, {
              _activeEls: { value: new Set() },
              _Audio: { value: options.AudioPlayer },
              _isSinkSupported: {
                value:
                  options.AudioFactory !== null &&
                  typeof options.AudioFactory.prototype.setSinkId === "function"
              },
              _maxDuration: { value: options.maxDuration },
              _maxDurationTimeout: { value: null, writable: true },
              _playPromise: { value: null, writable: true },
              _shouldLoop: { value: options.shouldLoop },
              _sinkIds: { value: ["default"] },
              isPlaying: {
                enumerable: true,
                get: function get() {
                  return !!this._playPromise;
                }
              },
              name: { enumerable: true, value: name },
              url: { enumerable: true, value: url }
            });
            if (this._Audio) {
              preload(this._Audio, url);
            }
          }
          function preload(AudioFactory, url) {
            var el = new AudioFactory(url);
            el.preload = "auto";
            el.muted = true;
            el.play();
          }
          Sound.prototype.setSinkIds = function setSinkIds(ids) {
            if (!this._isSinkSupported) {
              return;
            }
            ids = ids.forEach ? ids : [ids];
            [].splice.apply(
              this._sinkIds,
              [0, this._sinkIds.length].concat(ids)
            );
          };
          Sound.prototype.stop = function stop() {
            this._activeEls.forEach(function(audioEl) {
              audioEl.pause();
              audioEl.src = "";
              audioEl.load();
            });
            this._activeEls.clear();
            clearTimeout(this._maxDurationTimeout);
            this._playPromise = null;
            this._maxDurationTimeout = null;
          };
          Sound.prototype.play = function play() {
            if (this.isPlaying) {
              this.stop();
            }
            if (this._maxDuration > 0) {
              this._maxDurationTimeout = setTimeout(
                this.stop.bind(this),
                this._maxDuration
              );
            }
            var self = this;
            var playPromise = (this._playPromise = Promise.all(
              this._sinkIds.map(function createAudioElement(sinkId) {
                if (!self._Audio) {
                  return Promise.resolve();
                }
                var audioElement = new self._Audio(self.url);
                audioElement.loop = self._shouldLoop;
                audioElement.addEventListener("ended", function() {
                  self._activeEls.delete(audioElement);
                });
                return new Promise(function(resolve) {
                  audioElement.addEventListener("canplaythrough", resolve);
                }).then(function() {
                  if (!self.isPlaying || self._playPromise !== playPromise) {
                    return Promise.resolve();
                  }
                  return (self._isSinkSupported
                    ? audioElement.setSinkId(sinkId)
                    : Promise.resolve()
                  )
                    .then(function setSinkIdSuccess() {
                      self._activeEls.add(audioElement);
                      return audioElement.play();
                    })
                    .then(
                      function playSuccess() {
                        return audioElement;
                      },
                      function playFailure(reason) {
                        self._activeEls.delete(audioElement);
                        throw reason;
                      }
                    );
                });
              })
            ));
            return playPromise;
          };
          module.exports = Sound;
        },
        { "@twilio/audioplayer": 34 }
      ],
      28: [
        function(require, module, exports) {
          "use strict";
          Object.defineProperty(exports, "__esModule", { value: true });
          var LogLevel;
          (function(LogLevel) {
            LogLevel["Off"] = "off";
            LogLevel["Debug"] = "debug";
            LogLevel["Info"] = "info";
            LogLevel["Warn"] = "warn";
            LogLevel["Error"] = "error";
          })((LogLevel = exports.LogLevel || (exports.LogLevel = {})));
          var logLevelMethods = ((_a = {}),
          (_a[LogLevel.Debug] = "info"),
          (_a[LogLevel.Info] = "info"),
          (_a[LogLevel.Warn] = "warn"),
          (_a[LogLevel.Error] = "error"),
          _a);
          var logLevelRanks = ((_b = {}),
          (_b[LogLevel.Debug] = 0),
          (_b[LogLevel.Info] = 1),
          (_b[LogLevel.Warn] = 2),
          (_b[LogLevel.Error] = 3),
          (_b[LogLevel.Off] = 4),
          _b);
          var Log = (function() {
            function Log(_logLevel, options) {
              this._logLevel = _logLevel;
              this._console = console;
              if (options && options.console) {
                this._console = options.console;
              }
            }
            Object.defineProperty(Log.prototype, "logLevel", {
              get: function() {
                return this._logLevel;
              },
              enumerable: true,
              configurable: true
            });
            Log.prototype.debug = function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              this.log.apply(this, [LogLevel.Debug].concat(args));
            };
            Log.prototype.error = function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              this.log.apply(this, [LogLevel.Error].concat(args));
            };
            Log.prototype.info = function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              this.log.apply(this, [LogLevel.Info].concat(args));
            };
            Log.prototype.log = function(logLevel) {
              var args = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }
              var methodName = logLevelMethods[logLevel];
              if (
                methodName &&
                logLevelRanks[this.logLevel] <= logLevelRanks[logLevel]
              ) {
                (_a = this._console)[methodName].apply(_a, args);
              }
              var _a;
            };
            Log.prototype.setLogLevel = function(logLevel) {
              this._logLevel = logLevel;
            };
            Log.prototype.warn = function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              this.log.apply(this, [LogLevel.Warn].concat(args));
            };
            return Log;
          })();
          exports.default = Log;
          var _a, _b;
        },
        {}
      ],
      29: [
        function(require, module, exports) {
          (function(global) {
            function TwilioException(message) {
              if (!(this instanceof TwilioException)) {
                return new TwilioException(message);
              }
              this.message = message;
            }
            TwilioException.prototype.toString = function() {
              return "Twilio.Exception: " + this.message;
            };
            function average(values) {
              return values && values.length
                ? values.reduce(function(t, v) {
                    return t + v;
                  }) / values.length
                : 0;
            }
            function difference(lefts, rights, getKey) {
              getKey =
                getKey ||
                function(a) {
                  return a;
                };
              var rightKeys = new Set(rights.map(getKey));
              return lefts.filter(function(left) {
                return !rightKeys.has(getKey(left));
              });
            }
            function isElectron(navigator) {
              return !!navigator.userAgent.match("Electron");
            }
            function isChrome(window, navigator) {
              var isCriOS = !!navigator.userAgent.match("CriOS");
              var isGoogle =
                typeof window.chrome !== "undefined" &&
                navigator.vendor === "Google Inc." &&
                navigator.userAgent.indexOf("OPR") === -1 &&
                navigator.userAgent.indexOf("Edge") === -1;
              return isCriOS || isElectron(navigator) || isGoogle;
            }
            function isFirefox(navigator) {
              navigator =
                navigator ||
                (typeof window === "undefined"
                  ? global.navigator
                  : window.navigator);
              return (
                !!navigator &&
                typeof navigator.userAgent === "string" &&
                /firefox|fxios/i.test(navigator.userAgent)
              );
            }
            function isEdge(navigator) {
              navigator =
                navigator ||
                (typeof window === "undefined"
                  ? global.navigator
                  : window.navigator);
              return (
                !!navigator &&
                typeof navigator.userAgent === "string" &&
                /edge\/\d+/i.test(navigator.userAgent)
              );
            }
            function isSafari(navigator) {
              return (
                !!navigator.vendor &&
                navigator.vendor.indexOf("Apple") !== -1 &&
                navigator.userAgent &&
                navigator.userAgent.indexOf("CriOS") === -1 &&
                navigator.userAgent.indexOf("FxiOS") === -1
              );
            }
            function isUnifiedPlanDefault(
              window,
              navigator,
              PeerConnection,
              RtpTransceiver
            ) {
              if (
                typeof window === "undefined" ||
                typeof navigator === "undefined" ||
                typeof PeerConnection === "undefined" ||
                typeof RtpTransceiver === "undefined" ||
                typeof PeerConnection.prototype === "undefined" ||
                typeof RtpTransceiver.prototype === "undefined"
              ) {
                return false;
              }
              if (
                isChrome(window, navigator) &&
                PeerConnection.prototype.addTransceiver
              ) {
                var pc = new PeerConnection();
                var isUnifiedPlan = true;
                try {
                  pc.addTransceiver("audio");
                } catch (e) {
                  isUnifiedPlan = false;
                }
                pc.close();
                return isUnifiedPlan;
              } else if (isFirefox(navigator)) {
                return true;
              } else if (isSafari(navigator)) {
                return "currentDirection" in RtpTransceiver.prototype;
              }
              return false;
            }
            function queryToJson(params) {
              if (!params) {
                return "";
              }
              return params.split("&").reduce(function(output, pair) {
                var parts = pair.split("=");
                var key = parts[0];
                var value = decodeURIComponent(
                  (parts[1] || "").replace(/\+/g, "%20")
                );
                if (key) {
                  output[key] = value;
                }
                return output;
              }, {});
            }
            function flatMap(list, mapFn) {
              var listArray =
                list instanceof Map || list instanceof Set
                  ? Array.from(list.values())
                  : list;
              mapFn =
                mapFn ||
                function(item) {
                  return item;
                };
              return listArray.reduce(function(flattened, item) {
                var mapped = mapFn(item);
                return flattened.concat(mapped);
              }, []);
            }
            exports.Exception = TwilioException;
            exports.average = average;
            exports.difference = difference;
            exports.isElectron = isElectron;
            exports.isChrome = isChrome;
            exports.isFirefox = isFirefox;
            exports.isEdge = isEdge;
            exports.isSafari = isSafari;
            exports.isUnifiedPlanDefault = isUnifiedPlanDefault;
            exports.queryToJson = queryToJson;
            exports.flatMap = flatMap;
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {}
      ],
      30: [
        function(require, module, exports) {
          "use strict";
          var __extends =
            (this && this.__extends) ||
            (function() {
              var extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function(d, b) {
                    d.__proto__ = b;
                  }) ||
                function(d, b) {
                  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();
          Object.defineProperty(exports, "__esModule", { value: true });
          var events_1 = require("events");
          var WebSocket = require("ws");
          var tslog_1 = require("./tslog");
          var Backoff = require("backoff");
          var CONNECT_SUCCESS_TIMEOUT = 1e4;
          var CONNECT_TIMEOUT = 5e3;
          var HEARTBEAT_TIMEOUT = 15e3;
          var WSTransportState;
          (function(WSTransportState) {
            WSTransportState["Connecting"] = "connecting";
            WSTransportState["Closed"] = "closed";
            WSTransportState["Open"] = "open";
          })(
            (WSTransportState =
              exports.WSTransportState || (exports.WSTransportState = {}))
          );
          var WSTransport = (function(_super) {
            __extends(WSTransport, _super);
            function WSTransport(uri, options) {
              if (options === void 0) {
                options = {};
              }
              var _this = _super.call(this) || this;
              _this.state = WSTransportState.Closed;
              _this._onSocketClose = function() {
                _this._closeSocket();
              };
              _this._onSocketError = function(err) {
                _this._log.info("WebSocket received error: " + err.message);
                _this.emit("error", {
                  code: 31e3,
                  message: err.message || "WSTransport socket error"
                });
              };
              _this._onSocketMessage = function(message) {
                _this._setHeartbeatTimeout();
                if (_this._socket && message.data === "\n") {
                  _this._socket.send("\n");
                  return;
                }
                _this.emit("message", message);
              };
              _this._onSocketOpen = function() {
                _this._log.info("WebSocket opened successfully.");
                _this._timeOpened = Date.now();
                _this.state = WSTransportState.Open;
                clearTimeout(_this._connectTimeout);
                _this._setHeartbeatTimeout();
                _this.emit("open");
              };
              _this._backoff = Backoff.exponential({
                factor: 2,
                initialDelay: 100,
                maxDelay:
                  typeof options.backoffMaxMs === "number"
                    ? Math.max(options.backoffMaxMs, 3e3)
                    : 2e4,
                randomisationFactor: 0.4
              });
              _this._log = new tslog_1.default(
                options.logLevel || tslog_1.LogLevel.Off
              );
              _this._uri = uri;
              _this._WebSocket = options.WebSocket || WebSocket;
              _this._backoff.on("backoff", function(_, delay) {
                if (_this.state === WSTransportState.Closed) {
                  return;
                }
                _this._log.info(
                  "Will attempt to reconnect WebSocket in " + delay + "ms"
                );
              });
              _this._backoff.on("ready", function(attempt) {
                if (_this.state === WSTransportState.Closed) {
                  return;
                }
                _this._connect(attempt + 1);
              });
              return _this;
            }
            WSTransport.prototype.close = function() {
              this._log.info("WSTransport.close() called...");
              this._close();
            };
            WSTransport.prototype.open = function() {
              this._log.info("WSTransport.open() called...");
              if (
                this._socket &&
                (this._socket.readyState === WebSocket.CONNECTING ||
                  this._socket.readyState === WebSocket.OPEN)
              ) {
                this._log.info("WebSocket already open.");
                return;
              }
              this._connect();
            };
            WSTransport.prototype.send = function(message) {
              if (!this._socket || this._socket.readyState !== WebSocket.OPEN) {
                return false;
              }
              try {
                this._socket.send(message);
              } catch (e) {
                this._log.info("Error while sending message:", e.message);
                this._closeSocket();
                return false;
              }
              return true;
            };
            WSTransport.prototype._close = function() {
              this.state = WSTransportState.Closed;
              this._closeSocket();
            };
            WSTransport.prototype._closeSocket = function() {
              clearTimeout(this._connectTimeout);
              clearTimeout(this._heartbeatTimeout);
              this._log.info("Closing and cleaning up WebSocket...");
              if (!this._socket) {
                this._log.info("No WebSocket to clean up.");
                return;
              }
              this._socket.removeEventListener("close", this._onSocketClose);
              this._socket.removeEventListener("error", this._onSocketError);
              this._socket.removeEventListener(
                "message",
                this._onSocketMessage
              );
              this._socket.removeEventListener("open", this._onSocketOpen);
              if (
                this._socket.readyState === WebSocket.CONNECTING ||
                this._socket.readyState === WebSocket.OPEN
              ) {
                this._socket.close();
              }
              if (
                this._timeOpened &&
                Date.now() - this._timeOpened > CONNECT_SUCCESS_TIMEOUT
              ) {
                this._backoff.reset();
              }
              this._backoff.backoff();
              delete this._socket;
              this.emit("close");
            };
            WSTransport.prototype._connect = function(retryCount) {
              var _this = this;
              if (retryCount) {
                this._log.info(
                  "Attempting to reconnect (retry #" + retryCount + ")..."
                );
              } else {
                this._log.info("Attempting to connect...");
              }
              this._closeSocket();
              this.state = WSTransportState.Connecting;
              var socket = null;
              try {
                socket = new this._WebSocket(this._uri);
              } catch (e) {
                this._log.info("Could not connect to endpoint:", e.message);
                this._close();
                this.emit("error", {
                  code: 31e3,
                  message: e.message || "Could not connect to " + this._uri
                });
                return;
              }
              delete this._timeOpened;
              this._connectTimeout = setTimeout(function() {
                _this._log.info("WebSocket connection attempt timed out.");
                _this._closeSocket();
              }, CONNECT_TIMEOUT);
              socket.addEventListener("close", this._onSocketClose);
              socket.addEventListener("error", this._onSocketError);
              socket.addEventListener("message", this._onSocketMessage);
              socket.addEventListener("open", this._onSocketOpen);
              this._socket = socket;
            };
            WSTransport.prototype._setHeartbeatTimeout = function() {
              var _this = this;
              clearTimeout(this._heartbeatTimeout);
              this._heartbeatTimeout = setTimeout(function() {
                _this._log.info(
                  "No messages received in " +
                    HEARTBEAT_TIMEOUT / 1e3 +
                    " seconds. Reconnecting..."
                );
                _this._closeSocket();
              }, HEARTBEAT_TIMEOUT);
            };
            return WSTransport;
          })(events_1.EventEmitter);
          exports.default = WSTransport;
        },
        { "./tslog": 28, backoff: 36, events: 42, ws: 1 }
      ],
      31: [
        function(require, module, exports) {
          "use strict";
          var _regenerator = require("babel-runtime/regenerator");
          var _regenerator2 = _interopRequireDefault(_regenerator);
          var _createClass = (function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self, call) {
            if (!self) {
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            }
            return call &&
              (typeof call === "object" || typeof call === "function")
              ? call
              : self;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof superClass
              );
            }
            subClass.prototype = Object.create(
              superClass && superClass.prototype,
              {
                constructor: {
                  value: subClass,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              }
            );
            if (superClass)
              Object.setPrototypeOf
                ? Object.setPrototypeOf(subClass, superClass)
                : (subClass.__proto__ = superClass);
          }
          var __awaiter =
            (undefined && undefined.__awaiter) ||
            function(thisArg, _arguments, P, generator) {
              return new (P || (P = Promise))(function(resolve, reject) {
                function fulfilled(value) {
                  try {
                    step(generator.next(value));
                  } catch (e) {
                    reject(e);
                  }
                }
                function rejected(value) {
                  try {
                    step(generator["throw"](value));
                  } catch (e) {
                    reject(e);
                  }
                }
                function step(result) {
                  result.done
                    ? resolve(result.value)
                    : new P(function(resolve) {
                        resolve(result.value);
                      }).then(fulfilled, rejected);
                }
                step(
                  (generator = generator.apply(
                    thisArg,
                    _arguments || []
                  )).next()
                );
              });
            };
          Object.defineProperty(exports, "__esModule", { value: true });
          var Deferred_1 = require("./Deferred");
          var EventTarget_1 = require("./EventTarget");
          var AudioPlayer = (function(_EventTarget_1$defaul) {
            _inherits(AudioPlayer, _EventTarget_1$defaul);
            function AudioPlayer(audioContext) {
              var srcOrOptions =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : {};
              var options =
                arguments.length > 2 && arguments[2] !== undefined
                  ? arguments[2]
                  : {};
              _classCallCheck(this, AudioPlayer);
              var _this = _possibleConstructorReturn(
                this,
                (
                  AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)
                ).call(this)
              );
              _this._audioNode = null;
              _this._pendingPlayDeferreds = [];
              _this._loop = false;
              _this._src = "";
              _this._sinkId = "default";
              if (typeof srcOrOptions !== "string") {
                options = srcOrOptions;
              }
              _this._audioContext = audioContext;
              _this._audioElement = new (options.AudioFactory || Audio)();
              _this._bufferPromise = _this._createPlayDeferred().promise;
              _this._destination = _this._audioContext.destination;
              _this._gainNode = _this._audioContext.createGain();
              _this._gainNode.connect(_this._destination);
              _this._XMLHttpRequest =
                options.XMLHttpRequestFactory || XMLHttpRequest;
              _this.addEventListener("canplaythrough", function() {
                _this._resolvePlayDeferreds();
              });
              if (typeof srcOrOptions === "string") {
                _this.src = srcOrOptions;
              }
              return _this;
            }
            _createClass(AudioPlayer, [
              {
                key: "load",
                value: function load() {
                  this._load(this._src);
                }
              },
              {
                key: "pause",
                value: function pause() {
                  if (this.paused) {
                    return;
                  }
                  this._audioElement.pause();
                  this._audioNode.stop();
                  this._audioNode.disconnect(this._gainNode);
                  this._audioNode = null;
                  this._rejectPlayDeferreds(
                    new Error(
                      "The play() request was interrupted by a call to pause()."
                    )
                  );
                }
              },
              {
                key: "play",
                value: function play() {
                  return __awaiter(
                    this,
                    void 0,
                    void 0,
                    _regenerator2.default.mark(function _callee() {
                      var _this2 = this;
                      var buffer;
                      return _regenerator2.default.wrap(
                        function _callee$(_context) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                if (this.paused) {
                                  _context.next = 6;
                                  break;
                                }
                                _context.next = 3;
                                return this._bufferPromise;
                              case 3:
                                if (this.paused) {
                                  _context.next = 5;
                                  break;
                                }
                                return _context.abrupt("return");
                              case 5:
                                throw new Error(
                                  "The play() request was interrupted by a call to pause()."
                                );
                              case 6:
                                this._audioNode = this._audioContext.createBufferSource();
                                this._audioNode.loop = this.loop;
                                this._audioNode.addEventListener(
                                  "ended",
                                  function() {
                                    if (
                                      _this2._audioNode &&
                                      _this2._audioNode.loop
                                    ) {
                                      return;
                                    }
                                    _this2.dispatchEvent("ended");
                                  }
                                );
                                _context.next = 11;
                                return this._bufferPromise;
                              case 11:
                                buffer = _context.sent;
                                if (!this.paused) {
                                  _context.next = 14;
                                  break;
                                }
                                throw new Error(
                                  "The play() request was interrupted by a call to pause()."
                                );
                              case 14:
                                this._audioNode.buffer = buffer;
                                this._audioNode.connect(this._gainNode);
                                this._audioNode.start();
                                if (!this._audioElement.srcObject) {
                                  _context.next = 20;
                                  break;
                                }
                                this.addEventListener("ended", function() {
                                  _this2._audioElement.srcObject = null;
                                });
                                return _context.abrupt(
                                  "return",
                                  this._audioElement.play()
                                );
                              case 20:
                              case "end":
                                return _context.stop();
                            }
                          }
                        },
                        _callee,
                        this
                      );
                    })
                  );
                }
              },
              {
                key: "setSinkId",
                value: function setSinkId(sinkId) {
                  return __awaiter(
                    this,
                    void 0,
                    void 0,
                    _regenerator2.default.mark(function _callee2() {
                      return _regenerator2.default.wrap(
                        function _callee2$(_context2) {
                          while (1) {
                            switch ((_context2.prev = _context2.next)) {
                              case 0:
                                if (
                                  !(
                                    typeof this._audioElement.setSinkId !==
                                    "function"
                                  )
                                ) {
                                  _context2.next = 2;
                                  break;
                                }
                                throw new Error(
                                  "This browser does not support setSinkId."
                                );
                              case 2:
                                if (!(sinkId === this.sinkId)) {
                                  _context2.next = 4;
                                  break;
                                }
                                return _context2.abrupt("return");
                              case 4:
                                if (!(sinkId === "default")) {
                                  _context2.next = 11;
                                  break;
                                }
                                if (!this.paused) {
                                  this._gainNode.disconnect(this._destination);
                                }
                                this._audioElement.srcObject = null;
                                this._destination = this._audioContext.destination;
                                this._gainNode.connect(this._destination);
                                this._sinkId = sinkId;
                                return _context2.abrupt("return");
                              case 11:
                                _context2.next = 13;
                                return this._audioElement.setSinkId(sinkId);
                              case 13:
                                if (!this._audioElement.srcObject) {
                                  _context2.next = 15;
                                  break;
                                }
                                return _context2.abrupt("return");
                              case 15:
                                this._gainNode.disconnect(
                                  this._audioContext.destination
                                );
                                this._destination = this._audioContext.createMediaStreamDestination();
                                this._audioElement.srcObject = this._destination.stream;
                                this._sinkId = sinkId;
                                this._gainNode.connect(this._destination);
                              case 20:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        },
                        _callee2,
                        this
                      );
                    })
                  );
                }
              },
              {
                key: "_createPlayDeferred",
                value: function _createPlayDeferred() {
                  var deferred = new Deferred_1.default();
                  this._pendingPlayDeferreds.push(deferred);
                  return deferred;
                }
              },
              {
                key: "_load",
                value: function _load(src) {
                  var _this3 = this;
                  if (this._src && this._src !== src) {
                    this.pause();
                  }
                  this._src = src;
                  this._bufferPromise = new Promise(function(resolve, reject) {
                    return __awaiter(
                      _this3,
                      void 0,
                      void 0,
                      _regenerator2.default.mark(function _callee3() {
                        var buffer;
                        return _regenerator2.default.wrap(
                          function _callee3$(_context3) {
                            while (1) {
                              switch ((_context3.prev = _context3.next)) {
                                case 0:
                                  if (src) {
                                    _context3.next = 2;
                                    break;
                                  }
                                  return _context3.abrupt(
                                    "return",
                                    this._createPlayDeferred().promise
                                  );
                                case 2:
                                  _context3.next = 4;
                                  return bufferSound(
                                    this._audioContext,
                                    this._XMLHttpRequest,
                                    src
                                  );
                                case 4:
                                  buffer = _context3.sent;
                                  this.dispatchEvent("canplaythrough");
                                  resolve(buffer);
                                case 7:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          },
                          _callee3,
                          this
                        );
                      })
                    );
                  });
                }
              },
              {
                key: "_rejectPlayDeferreds",
                value: function _rejectPlayDeferreds(reason) {
                  var deferreds = this._pendingPlayDeferreds;
                  deferreds.splice(0, deferreds.length).forEach(function(_ref) {
                    var reject = _ref.reject;
                    return reject(reason);
                  });
                }
              },
              {
                key: "_resolvePlayDeferreds",
                value: function _resolvePlayDeferreds(result) {
                  var deferreds = this._pendingPlayDeferreds;
                  deferreds
                    .splice(0, deferreds.length)
                    .forEach(function(_ref2) {
                      var resolve = _ref2.resolve;
                      return resolve(result);
                    });
                }
              },
              {
                key: "destination",
                get: function get() {
                  return this._destination;
                }
              },
              {
                key: "loop",
                get: function get() {
                  return this._loop;
                },
                set: function set(shouldLoop) {
                  if (!shouldLoop && this.loop && !this.paused) {
                    var _pauseAfterPlaythrough = function _pauseAfterPlaythrough() {
                      self._audioNode.removeEventListener(
                        "ended",
                        _pauseAfterPlaythrough
                      );
                      self.pause();
                    };
                    var self = this;
                    this._audioNode.addEventListener(
                      "ended",
                      _pauseAfterPlaythrough
                    );
                  }
                  this._loop = shouldLoop;
                }
              },
              {
                key: "muted",
                get: function get() {
                  return this._gainNode.gain.value === 0;
                },
                set: function set(shouldBeMuted) {
                  this._gainNode.gain.value = shouldBeMuted ? 0 : 1;
                }
              },
              {
                key: "paused",
                get: function get() {
                  return this._audioNode === null;
                }
              },
              {
                key: "src",
                get: function get() {
                  return this._src;
                },
                set: function set(src) {
                  this._load(src);
                }
              },
              {
                key: "sinkId",
                get: function get() {
                  return this._sinkId;
                }
              }
            ]);
            return AudioPlayer;
          })(EventTarget_1.default);
          exports.default = AudioPlayer;
          function bufferSound(context, RequestFactory, src) {
            return __awaiter(
              this,
              void 0,
              void 0,
              _regenerator2.default.mark(function _callee4() {
                var request, event;
                return _regenerator2.default.wrap(
                  function _callee4$(_context4) {
                    while (1) {
                      switch ((_context4.prev = _context4.next)) {
                        case 0:
                          request = new RequestFactory();
                          request.open("GET", src, true);
                          request.responseType = "arraybuffer";
                          _context4.next = 5;
                          return new Promise(function(resolve) {
                            request.addEventListener("load", resolve);
                            request.send();
                          });
                        case 5:
                          event = _context4.sent;
                          _context4.prev = 6;
                          return _context4.abrupt(
                            "return",
                            context.decodeAudioData(event.target.response)
                          );
                        case 10:
                          _context4.prev = 10;
                          _context4.t0 = _context4["catch"](6);
                          return _context4.abrupt(
                            "return",
                            new Promise(function(resolve) {
                              context.decodeAudioData(
                                event.target.response,
                                resolve
                              );
                            })
                          );
                        case 13:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  },
                  _callee4,
                  this,
                  [[6, 10]]
                );
              })
            );
          }
        },
        {
          "./Deferred": 32,
          "./EventTarget": 33,
          "babel-runtime/regenerator": 35
        }
      ],
      32: [
        function(require, module, exports) {
          "use strict";
          var _createClass = (function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          Object.defineProperty(exports, "__esModule", { value: true });
          var Deferred = (function() {
            function Deferred() {
              var _this = this;
              _classCallCheck(this, Deferred);
              this.promise = new Promise(function(resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
              });
            }
            _createClass(Deferred, [
              {
                key: "reject",
                get: function get() {
                  return this._reject;
                }
              },
              {
                key: "resolve",
                get: function get() {
                  return this._resolve;
                }
              }
            ]);
            return Deferred;
          })();
          exports.default = Deferred;
        },
        {}
      ],
      33: [
        function(require, module, exports) {
          "use strict";
          var _createClass = (function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          Object.defineProperty(exports, "__esModule", { value: true });
          var events_1 = require("events");
          var EventTarget = (function() {
            function EventTarget() {
              _classCallCheck(this, EventTarget);
              this._eventEmitter = new events_1.EventEmitter();
            }
            _createClass(EventTarget, [
              {
                key: "addEventListener",
                value: function addEventListener(name, handler) {
                  return this._eventEmitter.addListener(name, handler);
                }
              },
              {
                key: "dispatchEvent",
                value: function dispatchEvent(name) {
                  var _eventEmitter;
                  for (
                    var _len = arguments.length,
                      args = Array(_len > 1 ? _len - 1 : 0),
                      _key = 1;
                    _key < _len;
                    _key++
                  ) {
                    args[_key - 1] = arguments[_key];
                  }
                  return (_eventEmitter = this._eventEmitter).emit.apply(
                    _eventEmitter,
                    [name].concat(args)
                  );
                }
              },
              {
                key: "removeEventListener",
                value: function removeEventListener(name, handler) {
                  return this._eventEmitter.removeListener(name, handler);
                }
              }
            ]);
            return EventTarget;
          })();
          exports.default = EventTarget;
        },
        { events: 42 }
      ],
      34: [
        function(require, module, exports) {
          "use strict";
          var AudioPlayer = require("./AudioPlayer");
          module.exports = AudioPlayer.default;
        },
        { "./AudioPlayer": 31 }
      ],
      35: [
        function(require, module, exports) {
          module.exports = require("regenerator-runtime");
        },
        { "regenerator-runtime": 47 }
      ],
      36: [
        function(require, module, exports) {
          var Backoff = require("./lib/backoff");
          var ExponentialBackoffStrategy = require("./lib/strategy/exponential");
          var FibonacciBackoffStrategy = require("./lib/strategy/fibonacci");
          var FunctionCall = require("./lib/function_call.js");
          module.exports.Backoff = Backoff;
          module.exports.FunctionCall = FunctionCall;
          module.exports.FibonacciStrategy = FibonacciBackoffStrategy;
          module.exports.ExponentialStrategy = ExponentialBackoffStrategy;
          module.exports.fibonacci = function(options) {
            return new Backoff(new FibonacciBackoffStrategy(options));
          };
          module.exports.exponential = function(options) {
            return new Backoff(new ExponentialBackoffStrategy(options));
          };
          module.exports.call = function(fn, vargs, callback) {
            var args = Array.prototype.slice.call(arguments);
            fn = args[0];
            vargs = args.slice(1, args.length - 1);
            callback = args[args.length - 1];
            return new FunctionCall(fn, vargs, callback);
          };
        },
        {
          "./lib/backoff": 37,
          "./lib/function_call.js": 38,
          "./lib/strategy/exponential": 39,
          "./lib/strategy/fibonacci": 40
        }
      ],
      37: [
        function(require, module, exports) {
          var events = require("events");
          var precond = require("precond");
          var util = require("util");
          function Backoff(backoffStrategy) {
            events.EventEmitter.call(this);
            this.backoffStrategy_ = backoffStrategy;
            this.maxNumberOfRetry_ = -1;
            this.backoffNumber_ = 0;
            this.backoffDelay_ = 0;
            this.timeoutID_ = -1;
            this.handlers = { backoff: this.onBackoff_.bind(this) };
          }
          util.inherits(Backoff, events.EventEmitter);
          Backoff.prototype.failAfter = function(maxNumberOfRetry) {
            precond.checkArgument(
              maxNumberOfRetry > 0,
              "Expected a maximum number of retry greater than 0 but got %s.",
              maxNumberOfRetry
            );
            this.maxNumberOfRetry_ = maxNumberOfRetry;
          };
          Backoff.prototype.backoff = function(err) {
            precond.checkState(this.timeoutID_ === -1, "Backoff in progress.");
            if (this.backoffNumber_ === this.maxNumberOfRetry_) {
              this.emit("fail", err);
              this.reset();
            } else {
              this.backoffDelay_ = this.backoffStrategy_.next();
              this.timeoutID_ = setTimeout(
                this.handlers.backoff,
                this.backoffDelay_
              );
              this.emit(
                "backoff",
                this.backoffNumber_,
                this.backoffDelay_,
                err
              );
            }
          };
          Backoff.prototype.onBackoff_ = function() {
            this.timeoutID_ = -1;
            this.emit("ready", this.backoffNumber_, this.backoffDelay_);
            this.backoffNumber_++;
          };
          Backoff.prototype.reset = function() {
            this.backoffNumber_ = 0;
            this.backoffStrategy_.reset();
            clearTimeout(this.timeoutID_);
            this.timeoutID_ = -1;
          };
          module.exports = Backoff;
        },
        { events: 42, precond: 43, util: 53 }
      ],
      38: [
        function(require, module, exports) {
          var events = require("events");
          var precond = require("precond");
          var util = require("util");
          var Backoff = require("./backoff");
          var FibonacciBackoffStrategy = require("./strategy/fibonacci");
          function FunctionCall(fn, args, callback) {
            events.EventEmitter.call(this);
            precond.checkIsFunction(fn, "Expected fn to be a function.");
            precond.checkIsArray(args, "Expected args to be an array.");
            precond.checkIsFunction(
              callback,
              "Expected callback to be a function."
            );
            this.function_ = fn;
            this.arguments_ = args;
            this.callback_ = callback;
            this.lastResult_ = [];
            this.numRetries_ = 0;
            this.backoff_ = null;
            this.strategy_ = null;
            this.failAfter_ = -1;
            this.retryPredicate_ = FunctionCall.DEFAULT_RETRY_PREDICATE_;
            this.state_ = FunctionCall.State_.PENDING;
          }
          util.inherits(FunctionCall, events.EventEmitter);
          FunctionCall.State_ = {
            PENDING: 0,
            RUNNING: 1,
            COMPLETED: 2,
            ABORTED: 3
          };
          FunctionCall.DEFAULT_RETRY_PREDICATE_ = function(err) {
            return true;
          };
          FunctionCall.prototype.isPending = function() {
            return this.state_ == FunctionCall.State_.PENDING;
          };
          FunctionCall.prototype.isRunning = function() {
            return this.state_ == FunctionCall.State_.RUNNING;
          };
          FunctionCall.prototype.isCompleted = function() {
            return this.state_ == FunctionCall.State_.COMPLETED;
          };
          FunctionCall.prototype.isAborted = function() {
            return this.state_ == FunctionCall.State_.ABORTED;
          };
          FunctionCall.prototype.setStrategy = function(strategy) {
            precond.checkState(this.isPending(), "FunctionCall in progress.");
            this.strategy_ = strategy;
            return this;
          };
          FunctionCall.prototype.retryIf = function(retryPredicate) {
            precond.checkState(this.isPending(), "FunctionCall in progress.");
            this.retryPredicate_ = retryPredicate;
            return this;
          };
          FunctionCall.prototype.getLastResult = function() {
            return this.lastResult_.concat();
          };
          FunctionCall.prototype.getNumRetries = function() {
            return this.numRetries_;
          };
          FunctionCall.prototype.failAfter = function(maxNumberOfRetry) {
            precond.checkState(this.isPending(), "FunctionCall in progress.");
            this.failAfter_ = maxNumberOfRetry;
            return this;
          };
          FunctionCall.prototype.abort = function() {
            if (this.isCompleted() || this.isAborted()) {
              return;
            }
            if (this.isRunning()) {
              this.backoff_.reset();
            }
            this.state_ = FunctionCall.State_.ABORTED;
            this.lastResult_ = [new Error("Backoff aborted.")];
            this.emit("abort");
            this.doCallback_();
          };
          FunctionCall.prototype.start = function(backoffFactory) {
            precond.checkState(!this.isAborted(), "FunctionCall is aborted.");
            precond.checkState(
              this.isPending(),
              "FunctionCall already started."
            );
            var strategy = this.strategy_ || new FibonacciBackoffStrategy();
            this.backoff_ = backoffFactory
              ? backoffFactory(strategy)
              : new Backoff(strategy);
            this.backoff_.on("ready", this.doCall_.bind(this, true));
            this.backoff_.on("fail", this.doCallback_.bind(this));
            this.backoff_.on("backoff", this.handleBackoff_.bind(this));
            if (this.failAfter_ > 0) {
              this.backoff_.failAfter(this.failAfter_);
            }
            this.state_ = FunctionCall.State_.RUNNING;
            this.doCall_(false);
          };
          FunctionCall.prototype.doCall_ = function(isRetry) {
            if (isRetry) {
              this.numRetries_++;
            }
            var eventArgs = ["call"].concat(this.arguments_);
            events.EventEmitter.prototype.emit.apply(this, eventArgs);
            var callback = this.handleFunctionCallback_.bind(this);
            this.function_.apply(null, this.arguments_.concat(callback));
          };
          FunctionCall.prototype.doCallback_ = function() {
            this.callback_.apply(null, this.lastResult_);
          };
          FunctionCall.prototype.handleFunctionCallback_ = function() {
            if (this.isAborted()) {
              return;
            }
            var args = Array.prototype.slice.call(arguments);
            this.lastResult_ = args;
            events.EventEmitter.prototype.emit.apply(
              this,
              ["callback"].concat(args)
            );
            var err = args[0];
            if (err && this.retryPredicate_(err)) {
              this.backoff_.backoff(err);
            } else {
              this.state_ = FunctionCall.State_.COMPLETED;
              this.doCallback_();
            }
          };
          FunctionCall.prototype.handleBackoff_ = function(number, delay, err) {
            this.emit("backoff", number, delay, err);
          };
          module.exports = FunctionCall;
        },
        {
          "./backoff": 37,
          "./strategy/fibonacci": 40,
          events: 42,
          precond: 43,
          util: 53
        }
      ],
      39: [
        function(require, module, exports) {
          var util = require("util");
          var precond = require("precond");
          var BackoffStrategy = require("./strategy");
          function ExponentialBackoffStrategy(options) {
            BackoffStrategy.call(this, options);
            this.backoffDelay_ = 0;
            this.nextBackoffDelay_ = this.getInitialDelay();
            this.factor_ = ExponentialBackoffStrategy.DEFAULT_FACTOR;
            if (options && options.factor !== undefined) {
              precond.checkArgument(
                options.factor > 1,
                "Exponential factor should be greater than 1 but got %s.",
                options.factor
              );
              this.factor_ = options.factor;
            }
          }
          util.inherits(ExponentialBackoffStrategy, BackoffStrategy);
          ExponentialBackoffStrategy.DEFAULT_FACTOR = 2;
          ExponentialBackoffStrategy.prototype.next_ = function() {
            this.backoffDelay_ = Math.min(
              this.nextBackoffDelay_,
              this.getMaxDelay()
            );
            this.nextBackoffDelay_ = this.backoffDelay_ * this.factor_;
            return this.backoffDelay_;
          };
          ExponentialBackoffStrategy.prototype.reset_ = function() {
            this.backoffDelay_ = 0;
            this.nextBackoffDelay_ = this.getInitialDelay();
          };
          module.exports = ExponentialBackoffStrategy;
        },
        { "./strategy": 41, precond: 43, util: 53 }
      ],
      40: [
        function(require, module, exports) {
          var util = require("util");
          var BackoffStrategy = require("./strategy");
          function FibonacciBackoffStrategy(options) {
            BackoffStrategy.call(this, options);
            this.backoffDelay_ = 0;
            this.nextBackoffDelay_ = this.getInitialDelay();
          }
          util.inherits(FibonacciBackoffStrategy, BackoffStrategy);
          FibonacciBackoffStrategy.prototype.next_ = function() {
            var backoffDelay = Math.min(
              this.nextBackoffDelay_,
              this.getMaxDelay()
            );
            this.nextBackoffDelay_ += this.backoffDelay_;
            this.backoffDelay_ = backoffDelay;
            return backoffDelay;
          };
          FibonacciBackoffStrategy.prototype.reset_ = function() {
            this.nextBackoffDelay_ = this.getInitialDelay();
            this.backoffDelay_ = 0;
          };
          module.exports = FibonacciBackoffStrategy;
        },
        { "./strategy": 41, util: 53 }
      ],
      41: [
        function(require, module, exports) {
          var events = require("events");
          var util = require("util");
          function isDef(value) {
            return value !== undefined && value !== null;
          }
          function BackoffStrategy(options) {
            options = options || {};
            if (isDef(options.initialDelay) && options.initialDelay < 1) {
              throw new Error("The initial timeout must be greater than 0.");
            } else if (isDef(options.maxDelay) && options.maxDelay < 1) {
              throw new Error("The maximal timeout must be greater than 0.");
            }
            this.initialDelay_ = options.initialDelay || 100;
            this.maxDelay_ = options.maxDelay || 1e4;
            if (this.maxDelay_ <= this.initialDelay_) {
              throw new Error(
                "The maximal backoff delay must be " +
                  "greater than the initial backoff delay."
              );
            }
            if (
              isDef(options.randomisationFactor) &&
              (options.randomisationFactor < 0 ||
                options.randomisationFactor > 1)
            ) {
              throw new Error(
                "The randomisation factor must be between 0 and 1."
              );
            }
            this.randomisationFactor_ = options.randomisationFactor || 0;
          }
          BackoffStrategy.prototype.getMaxDelay = function() {
            return this.maxDelay_;
          };
          BackoffStrategy.prototype.getInitialDelay = function() {
            return this.initialDelay_;
          };
          BackoffStrategy.prototype.next = function() {
            var backoffDelay = this.next_();
            var randomisationMultiple =
              1 + Math.random() * this.randomisationFactor_;
            var randomizedDelay = Math.round(
              backoffDelay * randomisationMultiple
            );
            return randomizedDelay;
          };
          BackoffStrategy.prototype.next_ = function() {
            throw new Error("BackoffStrategy.next_() unimplemented.");
          };
          BackoffStrategy.prototype.reset = function() {
            this.reset_();
          };
          BackoffStrategy.prototype.reset_ = function() {
            throw new Error("BackoffStrategy.reset_() unimplemented.");
          };
          module.exports = BackoffStrategy;
        },
        { events: 42, util: 53 }
      ],
      42: [
        function(require, module, exports) {
          var objectCreate = Object.create || objectCreatePolyfill;
          var objectKeys = Object.keys || objectKeysPolyfill;
          var bind = Function.prototype.bind || functionBindPolyfill;
          function EventEmitter() {
            if (
              !this._events ||
              !Object.prototype.hasOwnProperty.call(this, "_events")
            ) {
              this._events = objectCreate(null);
              this._eventsCount = 0;
            }
            this._maxListeners = this._maxListeners || undefined;
          }
          module.exports = EventEmitter;
          EventEmitter.EventEmitter = EventEmitter;
          EventEmitter.prototype._events = undefined;
          EventEmitter.prototype._maxListeners = undefined;
          var defaultMaxListeners = 10;
          var hasDefineProperty;
          try {
            var o = {};
            if (Object.defineProperty)
              Object.defineProperty(o, "x", { value: 0 });
            hasDefineProperty = o.x === 0;
          } catch (err) {
            hasDefineProperty = false;
          }
          if (hasDefineProperty) {
            Object.defineProperty(EventEmitter, "defaultMaxListeners", {
              enumerable: true,
              get: function() {
                return defaultMaxListeners;
              },
              set: function(arg) {
                if (typeof arg !== "number" || arg < 0 || arg !== arg)
                  throw new TypeError(
                    '"defaultMaxListeners" must be a positive number'
                  );
                defaultMaxListeners = arg;
              }
            });
          } else {
            EventEmitter.defaultMaxListeners = defaultMaxListeners;
          }
          EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
            if (typeof n !== "number" || n < 0 || isNaN(n))
              throw new TypeError('"n" argument must be a positive number');
            this._maxListeners = n;
            return this;
          };
          function $getMaxListeners(that) {
            if (that._maxListeners === undefined)
              return EventEmitter.defaultMaxListeners;
            return that._maxListeners;
          }
          EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
            return $getMaxListeners(this);
          };
          function emitNone(handler, isFn, self) {
            if (isFn) handler.call(self);
            else {
              var len = handler.length;
              var listeners = arrayClone(handler, len);
              for (var i = 0; i < len; ++i) listeners[i].call(self);
            }
          }
          function emitOne(handler, isFn, self, arg1) {
            if (isFn) handler.call(self, arg1);
            else {
              var len = handler.length;
              var listeners = arrayClone(handler, len);
              for (var i = 0; i < len; ++i) listeners[i].call(self, arg1);
            }
          }
          function emitTwo(handler, isFn, self, arg1, arg2) {
            if (isFn) handler.call(self, arg1, arg2);
            else {
              var len = handler.length;
              var listeners = arrayClone(handler, len);
              for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2);
            }
          }
          function emitThree(handler, isFn, self, arg1, arg2, arg3) {
            if (isFn) handler.call(self, arg1, arg2, arg3);
            else {
              var len = handler.length;
              var listeners = arrayClone(handler, len);
              for (var i = 0; i < len; ++i)
                listeners[i].call(self, arg1, arg2, arg3);
            }
          }
          function emitMany(handler, isFn, self, args) {
            if (isFn) handler.apply(self, args);
            else {
              var len = handler.length;
              var listeners = arrayClone(handler, len);
              for (var i = 0; i < len; ++i) listeners[i].apply(self, args);
            }
          }
          EventEmitter.prototype.emit = function emit(type) {
            var er, handler, len, args, i, events;
            var doError = type === "error";
            events = this._events;
            if (events) doError = doError && events.error == null;
            else if (!doError) return false;
            if (doError) {
              if (arguments.length > 1) er = arguments[1];
              if (er instanceof Error) {
                throw er;
              } else {
                var err = new Error('Unhandled "error" event. (' + er + ")");
                err.context = er;
                throw err;
              }
              return false;
            }
            handler = events[type];
            if (!handler) return false;
            var isFn = typeof handler === "function";
            len = arguments.length;
            switch (len) {
              case 1:
                emitNone(handler, isFn, this);
                break;
              case 2:
                emitOne(handler, isFn, this, arguments[1]);
                break;
              case 3:
                emitTwo(handler, isFn, this, arguments[1], arguments[2]);
                break;
              case 4:
                emitThree(
                  handler,
                  isFn,
                  this,
                  arguments[1],
                  arguments[2],
                  arguments[3]
                );
                break;
              default:
                args = new Array(len - 1);
                for (i = 1; i < len; i++) args[i - 1] = arguments[i];
                emitMany(handler, isFn, this, args);
            }
            return true;
          };
          function _addListener(target, type, listener, prepend) {
            var m;
            var events;
            var existing;
            if (typeof listener !== "function")
              throw new TypeError('"listener" argument must be a function');
            events = target._events;
            if (!events) {
              events = target._events = objectCreate(null);
              target._eventsCount = 0;
            } else {
              if (events.newListener) {
                target.emit(
                  "newListener",
                  type,
                  listener.listener ? listener.listener : listener
                );
                events = target._events;
              }
              existing = events[type];
            }
            if (!existing) {
              existing = events[type] = listener;
              ++target._eventsCount;
            } else {
              if (typeof existing === "function") {
                existing = events[type] = prepend
                  ? [listener, existing]
                  : [existing, listener];
              } else {
                if (prepend) {
                  existing.unshift(listener);
                } else {
                  existing.push(listener);
                }
              }
              if (!existing.warned) {
                m = $getMaxListeners(target);
                if (m && m > 0 && existing.length > m) {
                  existing.warned = true;
                  var w = new Error(
                    "Possible EventEmitter memory leak detected. " +
                      existing.length +
                      ' "' +
                      String(type) +
                      '" listeners ' +
                      "added. Use emitter.setMaxListeners() to " +
                      "increase limit."
                  );
                  w.name = "MaxListenersExceededWarning";
                  w.emitter = target;
                  w.type = type;
                  w.count = existing.length;
                  if (typeof console === "object" && console.warn) {
                    console.warn("%s: %s", w.name, w.message);
                  }
                }
              }
            }
            return target;
          }
          EventEmitter.prototype.addListener = function addListener(
            type,
            listener
          ) {
            return _addListener(this, type, listener, false);
          };
          EventEmitter.prototype.on = EventEmitter.prototype.addListener;
          EventEmitter.prototype.prependListener = function prependListener(
            type,
            listener
          ) {
            return _addListener(this, type, listener, true);
          };
          function onceWrapper() {
            if (!this.fired) {
              this.target.removeListener(this.type, this.wrapFn);
              this.fired = true;
              switch (arguments.length) {
                case 0:
                  return this.listener.call(this.target);
                case 1:
                  return this.listener.call(this.target, arguments[0]);
                case 2:
                  return this.listener.call(
                    this.target,
                    arguments[0],
                    arguments[1]
                  );
                case 3:
                  return this.listener.call(
                    this.target,
                    arguments[0],
                    arguments[1],
                    arguments[2]
                  );
                default:
                  var args = new Array(arguments.length);
                  for (var i = 0; i < args.length; ++i) args[i] = arguments[i];
                  this.listener.apply(this.target, args);
              }
            }
          }
          function _onceWrap(target, type, listener) {
            var state = {
              fired: false,
              wrapFn: undefined,
              target: target,
              type: type,
              listener: listener
            };
            var wrapped = bind.call(onceWrapper, state);
            wrapped.listener = listener;
            state.wrapFn = wrapped;
            return wrapped;
          }
          EventEmitter.prototype.once = function once(type, listener) {
            if (typeof listener !== "function")
              throw new TypeError('"listener" argument must be a function');
            this.on(type, _onceWrap(this, type, listener));
            return this;
          };
          EventEmitter.prototype.prependOnceListener = function prependOnceListener(
            type,
            listener
          ) {
            if (typeof listener !== "function")
              throw new TypeError('"listener" argument must be a function');
            this.prependListener(type, _onceWrap(this, type, listener));
            return this;
          };
          EventEmitter.prototype.removeListener = function removeListener(
            type,
            listener
          ) {
            var list, events, position, i, originalListener;
            if (typeof listener !== "function")
              throw new TypeError('"listener" argument must be a function');
            events = this._events;
            if (!events) return this;
            list = events[type];
            if (!list) return this;
            if (list === listener || list.listener === listener) {
              if (--this._eventsCount === 0) this._events = objectCreate(null);
              else {
                delete events[type];
                if (events.removeListener)
                  this.emit("removeListener", type, list.listener || listener);
              }
            } else if (typeof list !== "function") {
              position = -1;
              for (i = list.length - 1; i >= 0; i--) {
                if (list[i] === listener || list[i].listener === listener) {
                  originalListener = list[i].listener;
                  position = i;
                  break;
                }
              }
              if (position < 0) return this;
              if (position === 0) list.shift();
              else spliceOne(list, position);
              if (list.length === 1) events[type] = list[0];
              if (events.removeListener)
                this.emit("removeListener", type, originalListener || listener);
            }
            return this;
          };
          EventEmitter.prototype.removeAllListeners = function removeAllListeners(
            type
          ) {
            var listeners, events, i;
            events = this._events;
            if (!events) return this;
            if (!events.removeListener) {
              if (arguments.length === 0) {
                this._events = objectCreate(null);
                this._eventsCount = 0;
              } else if (events[type]) {
                if (--this._eventsCount === 0)
                  this._events = objectCreate(null);
                else delete events[type];
              }
              return this;
            }
            if (arguments.length === 0) {
              var keys = objectKeys(events);
              var key;
              for (i = 0; i < keys.length; ++i) {
                key = keys[i];
                if (key === "removeListener") continue;
                this.removeAllListeners(key);
              }
              this.removeAllListeners("removeListener");
              this._events = objectCreate(null);
              this._eventsCount = 0;
              return this;
            }
            listeners = events[type];
            if (typeof listeners === "function") {
              this.removeListener(type, listeners);
            } else if (listeners) {
              for (i = listeners.length - 1; i >= 0; i--) {
                this.removeListener(type, listeners[i]);
              }
            }
            return this;
          };
          function _listeners(target, type, unwrap) {
            var events = target._events;
            if (!events) return [];
            var evlistener = events[type];
            if (!evlistener) return [];
            if (typeof evlistener === "function")
              return unwrap
                ? [evlistener.listener || evlistener]
                : [evlistener];
            return unwrap
              ? unwrapListeners(evlistener)
              : arrayClone(evlistener, evlistener.length);
          }
          EventEmitter.prototype.listeners = function listeners(type) {
            return _listeners(this, type, true);
          };
          EventEmitter.prototype.rawListeners = function rawListeners(type) {
            return _listeners(this, type, false);
          };
          EventEmitter.listenerCount = function(emitter, type) {
            if (typeof emitter.listenerCount === "function") {
              return emitter.listenerCount(type);
            } else {
              return listenerCount.call(emitter, type);
            }
          };
          EventEmitter.prototype.listenerCount = listenerCount;
          function listenerCount(type) {
            var events = this._events;
            if (events) {
              var evlistener = events[type];
              if (typeof evlistener === "function") {
                return 1;
              } else if (evlistener) {
                return evlistener.length;
              }
            }
            return 0;
          }
          EventEmitter.prototype.eventNames = function eventNames() {
            return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
          };
          function spliceOne(list, index) {
            for (
              var i = index, k = i + 1, n = list.length;
              k < n;
              i += 1, k += 1
            )
              list[i] = list[k];
            list.pop();
          }
          function arrayClone(arr, n) {
            var copy = new Array(n);
            for (var i = 0; i < n; ++i) copy[i] = arr[i];
            return copy;
          }
          function unwrapListeners(arr) {
            var ret = new Array(arr.length);
            for (var i = 0; i < ret.length; ++i) {
              ret[i] = arr[i].listener || arr[i];
            }
            return ret;
          }
          function objectCreatePolyfill(proto) {
            var F = function() {};
            F.prototype = proto;
            return new F();
          }
          function objectKeysPolyfill(obj) {
            var keys = [];
            for (var k in obj)
              if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
              }
            return k;
          }
          function functionBindPolyfill(context) {
            var fn = this;
            return function() {
              return fn.apply(context, arguments);
            };
          }
        },
        {}
      ],
      43: [
        function(require, module, exports) {
          module.exports = require("./lib/checks");
        },
        { "./lib/checks": 44 }
      ],
      44: [
        function(require, module, exports) {
          var util = require("util");
          var errors = (module.exports = require("./errors"));
          function failCheck(
            ExceptionConstructor,
            callee,
            messageFormat,
            formatArgs
          ) {
            messageFormat = messageFormat || "";
            var message = util.format.apply(
              this,
              [messageFormat].concat(formatArgs)
            );
            var error = new ExceptionConstructor(message);
            Error.captureStackTrace(error, callee);
            throw error;
          }
          function failArgumentCheck(callee, message, formatArgs) {
            failCheck(errors.IllegalArgumentError, callee, message, formatArgs);
          }
          function failStateCheck(callee, message, formatArgs) {
            failCheck(errors.IllegalStateError, callee, message, formatArgs);
          }
          module.exports.checkArgument = function(value, message) {
            if (!value) {
              failArgumentCheck(
                arguments.callee,
                message,
                Array.prototype.slice.call(arguments, 2)
              );
            }
          };
          module.exports.checkState = function(value, message) {
            if (!value) {
              failStateCheck(
                arguments.callee,
                message,
                Array.prototype.slice.call(arguments, 2)
              );
            }
          };
          module.exports.checkIsDef = function(value, message) {
            if (value !== undefined) {
              return value;
            }
            failArgumentCheck(
              arguments.callee,
              message || "Expected value to be defined but was undefined.",
              Array.prototype.slice.call(arguments, 2)
            );
          };
          module.exports.checkIsDefAndNotNull = function(value, message) {
            if (value != null) {
              return value;
            }
            failArgumentCheck(
              arguments.callee,
              message ||
                'Expected value to be defined and not null but got "' +
                  typeOf(value) +
                  '".',
              Array.prototype.slice.call(arguments, 2)
            );
          };
          function typeOf(value) {
            var s = typeof value;
            if (s == "object") {
              if (!value) {
                return "null";
              } else if (value instanceof Array) {
                return "array";
              }
            }
            return s;
          }
          function typeCheck(expect) {
            return function(value, message) {
              var type = typeOf(value);
              if (type == expect) {
                return value;
              }
              failArgumentCheck(
                arguments.callee,
                message || 'Expected "' + expect + '" but got "' + type + '".',
                Array.prototype.slice.call(arguments, 2)
              );
            };
          }
          module.exports.checkIsString = typeCheck("string");
          module.exports.checkIsArray = typeCheck("array");
          module.exports.checkIsNumber = typeCheck("number");
          module.exports.checkIsBoolean = typeCheck("boolean");
          module.exports.checkIsFunction = typeCheck("function");
          module.exports.checkIsObject = typeCheck("object");
        },
        { "./errors": 45, util: 53 }
      ],
      45: [
        function(require, module, exports) {
          var util = require("util");
          function IllegalArgumentError(message) {
            Error.call(this, message);
            this.message = message;
          }
          util.inherits(IllegalArgumentError, Error);
          IllegalArgumentError.prototype.name = "IllegalArgumentError";
          function IllegalStateError(message) {
            Error.call(this, message);
            this.message = message;
          }
          util.inherits(IllegalStateError, Error);
          IllegalStateError.prototype.name = "IllegalStateError";
          module.exports.IllegalStateError = IllegalStateError;
          module.exports.IllegalArgumentError = IllegalArgumentError;
        },
        { util: 53 }
      ],
      46: [
        function(require, module, exports) {
          var process = (module.exports = {});
          var cachedSetTimeout;
          var cachedClearTimeout;
          function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
          }
          function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
          }
          (function() {
            try {
              if (typeof setTimeout === "function") {
                cachedSetTimeout = setTimeout;
              } else {
                cachedSetTimeout = defaultSetTimout;
              }
            } catch (e) {
              cachedSetTimeout = defaultSetTimout;
            }
            try {
              if (typeof clearTimeout === "function") {
                cachedClearTimeout = clearTimeout;
              } else {
                cachedClearTimeout = defaultClearTimeout;
              }
            } catch (e) {
              cachedClearTimeout = defaultClearTimeout;
            }
          })();
          function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
              return setTimeout(fun, 0);
            }
            if (
              (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
              setTimeout
            ) {
              cachedSetTimeout = setTimeout;
              return setTimeout(fun, 0);
            }
            try {
              return cachedSetTimeout(fun, 0);
            } catch (e) {
              try {
                return cachedSetTimeout.call(null, fun, 0);
              } catch (e) {
                return cachedSetTimeout.call(this, fun, 0);
              }
            }
          }
          function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
              return clearTimeout(marker);
            }
            if (
              (cachedClearTimeout === defaultClearTimeout ||
                !cachedClearTimeout) &&
              clearTimeout
            ) {
              cachedClearTimeout = clearTimeout;
              return clearTimeout(marker);
            }
            try {
              return cachedClearTimeout(marker);
            } catch (e) {
              try {
                return cachedClearTimeout.call(null, marker);
              } catch (e) {
                return cachedClearTimeout.call(this, marker);
              }
            }
          }
          var queue = [];
          var draining = false;
          var currentQueue;
          var queueIndex = -1;
          function cleanUpNextTick() {
            if (!draining || !currentQueue) {
              return;
            }
            draining = false;
            if (currentQueue.length) {
              queue = currentQueue.concat(queue);
            } else {
              queueIndex = -1;
            }
            if (queue.length) {
              drainQueue();
            }
          }
          function drainQueue() {
            if (draining) {
              return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            while (len) {
              currentQueue = queue;
              queue = [];
              while (++queueIndex < len) {
                if (currentQueue) {
                  currentQueue[queueIndex].run();
                }
              }
              queueIndex = -1;
              len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
          }
          process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
              for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
              }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
              runTimeout(drainQueue);
            }
          };
          function Item(fun, array) {
            this.fun = fun;
            this.array = array;
          }
          Item.prototype.run = function() {
            this.fun.apply(null, this.array);
          };
          process.title = "browser";
          process.browser = true;
          process.env = {};
          process.argv = [];
          process.version = "";
          process.versions = {};
          function noop() {}
          process.on = noop;
          process.addListener = noop;
          process.once = noop;
          process.off = noop;
          process.removeListener = noop;
          process.removeAllListeners = noop;
          process.emit = noop;
          process.prependListener = noop;
          process.prependOnceListener = noop;
          process.listeners = function(name) {
            return [];
          };
          process.binding = function(name) {
            throw new Error("process.binding is not supported");
          };
          process.cwd = function() {
            return "/";
          };
          process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
          };
          process.umask = function() {
            return 0;
          };
        },
        {}
      ],
      47: [
        function(require, module, exports) {
          var g =
            (function() {
              return this;
            })() || Function("return this")();
          var hadRuntime =
            g.regeneratorRuntime &&
            Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;
          var oldRuntime = hadRuntime && g.regeneratorRuntime;
          g.regeneratorRuntime = undefined;
          module.exports = require("./runtime");
          if (hadRuntime) {
            g.regeneratorRuntime = oldRuntime;
          } else {
            try {
              delete g.regeneratorRuntime;
            } catch (e) {
              g.regeneratorRuntime = undefined;
            }
          }
        },
        { "./runtime": 48 }
      ],
      48: [
        function(require, module, exports) {
          !(function(global) {
            "use strict";
            var Op = Object.prototype;
            var hasOwn = Op.hasOwnProperty;
            var undefined;
            var $Symbol = typeof Symbol === "function" ? Symbol : {};
            var iteratorSymbol = $Symbol.iterator || "@@iterator";
            var asyncIteratorSymbol =
              $Symbol.asyncIterator || "@@asyncIterator";
            var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
            var inModule = typeof module === "object";
            var runtime = global.regeneratorRuntime;
            if (runtime) {
              if (inModule) {
                module.exports = runtime;
              }
              return;
            }
            runtime = global.regeneratorRuntime = inModule
              ? module.exports
              : {};
            function wrap(innerFn, outerFn, self, tryLocsList) {
              var protoGenerator =
                outerFn && outerFn.prototype instanceof Generator
                  ? outerFn
                  : Generator;
              var generator = Object.create(protoGenerator.prototype);
              var context = new Context(tryLocsList || []);
              generator._invoke = makeInvokeMethod(innerFn, self, context);
              return generator;
            }
            runtime.wrap = wrap;
            function tryCatch(fn, obj, arg) {
              try {
                return { type: "normal", arg: fn.call(obj, arg) };
              } catch (err) {
                return { type: "throw", arg: err };
              }
            }
            var GenStateSuspendedStart = "suspendedStart";
            var GenStateSuspendedYield = "suspendedYield";
            var GenStateExecuting = "executing";
            var GenStateCompleted = "completed";
            var ContinueSentinel = {};
            function Generator() {}
            function GeneratorFunction() {}
            function GeneratorFunctionPrototype() {}
            var IteratorPrototype = {};
            IteratorPrototype[iteratorSymbol] = function() {
              return this;
            };
            var getProto = Object.getPrototypeOf;
            var NativeIteratorPrototype =
              getProto && getProto(getProto(values([])));
            if (
              NativeIteratorPrototype &&
              NativeIteratorPrototype !== Op &&
              hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
            ) {
              IteratorPrototype = NativeIteratorPrototype;
            }
            var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
              IteratorPrototype
            ));
            GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
            GeneratorFunctionPrototype.constructor = GeneratorFunction;
            GeneratorFunctionPrototype[
              toStringTagSymbol
            ] = GeneratorFunction.displayName = "GeneratorFunction";
            function defineIteratorMethods(prototype) {
              ["next", "throw", "return"].forEach(function(method) {
                prototype[method] = function(arg) {
                  return this._invoke(method, arg);
                };
              });
            }
            runtime.isGeneratorFunction = function(genFun) {
              var ctor = typeof genFun === "function" && genFun.constructor;
              return ctor
                ? ctor === GeneratorFunction ||
                    (ctor.displayName || ctor.name) === "GeneratorFunction"
                : false;
            };
            runtime.mark = function(genFun) {
              if (Object.setPrototypeOf) {
                Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
              } else {
                genFun.__proto__ = GeneratorFunctionPrototype;
                if (!(toStringTagSymbol in genFun)) {
                  genFun[toStringTagSymbol] = "GeneratorFunction";
                }
              }
              genFun.prototype = Object.create(Gp);
              return genFun;
            };
            runtime.awrap = function(arg) {
              return { __await: arg };
            };
            function AsyncIterator(generator) {
              function invoke(method, arg, resolve, reject) {
                var record = tryCatch(generator[method], generator, arg);
                if (record.type === "throw") {
                  reject(record.arg);
                } else {
                  var result = record.arg;
                  var value = result.value;
                  if (
                    value &&
                    typeof value === "object" &&
                    hasOwn.call(value, "__await")
                  ) {
                    return Promise.resolve(value.__await).then(
                      function(value) {
                        invoke("next", value, resolve, reject);
                      },
                      function(err) {
                        invoke("throw", err, resolve, reject);
                      }
                    );
                  }
                  return Promise.resolve(value).then(function(unwrapped) {
                    result.value = unwrapped;
                    resolve(result);
                  }, reject);
                }
              }
              var previousPromise;
              function enqueue(method, arg) {
                function callInvokeWithMethodAndArg() {
                  return new Promise(function(resolve, reject) {
                    invoke(method, arg, resolve, reject);
                  });
                }
                return (previousPromise = previousPromise
                  ? previousPromise.then(
                      callInvokeWithMethodAndArg,
                      callInvokeWithMethodAndArg
                    )
                  : callInvokeWithMethodAndArg());
              }
              this._invoke = enqueue;
            }
            defineIteratorMethods(AsyncIterator.prototype);
            AsyncIterator.prototype[asyncIteratorSymbol] = function() {
              return this;
            };
            runtime.AsyncIterator = AsyncIterator;
            runtime.async = function(innerFn, outerFn, self, tryLocsList) {
              var iter = new AsyncIterator(
                wrap(innerFn, outerFn, self, tryLocsList)
              );
              return runtime.isGeneratorFunction(outerFn)
                ? iter
                : iter.next().then(function(result) {
                    return result.done ? result.value : iter.next();
                  });
            };
            function makeInvokeMethod(innerFn, self, context) {
              var state = GenStateSuspendedStart;
              return function invoke(method, arg) {
                if (state === GenStateExecuting) {
                  throw new Error("Generator is already running");
                }
                if (state === GenStateCompleted) {
                  if (method === "throw") {
                    throw arg;
                  }
                  return doneResult();
                }
                context.method = method;
                context.arg = arg;
                while (true) {
                  var delegate = context.delegate;
                  if (delegate) {
                    var delegateResult = maybeInvokeDelegate(delegate, context);
                    if (delegateResult) {
                      if (delegateResult === ContinueSentinel) continue;
                      return delegateResult;
                    }
                  }
                  if (context.method === "next") {
                    context.sent = context._sent = context.arg;
                  } else if (context.method === "throw") {
                    if (state === GenStateSuspendedStart) {
                      state = GenStateCompleted;
                      throw context.arg;
                    }
                    context.dispatchException(context.arg);
                  } else if (context.method === "return") {
                    context.abrupt("return", context.arg);
                  }
                  state = GenStateExecuting;
                  var record = tryCatch(innerFn, self, context);
                  if (record.type === "normal") {
                    state = context.done
                      ? GenStateCompleted
                      : GenStateSuspendedYield;
                    if (record.arg === ContinueSentinel) {
                      continue;
                    }
                    return { value: record.arg, done: context.done };
                  } else if (record.type === "throw") {
                    state = GenStateCompleted;
                    context.method = "throw";
                    context.arg = record.arg;
                  }
                }
              };
            }
            function maybeInvokeDelegate(delegate, context) {
              var method = delegate.iterator[context.method];
              if (method === undefined) {
                context.delegate = null;
                if (context.method === "throw") {
                  if (delegate.iterator.return) {
                    context.method = "return";
                    context.arg = undefined;
                    maybeInvokeDelegate(delegate, context);
                    if (context.method === "throw") {
                      return ContinueSentinel;
                    }
                  }
                  context.method = "throw";
                  context.arg = new TypeError(
                    "The iterator does not provide a 'throw' method"
                  );
                }
                return ContinueSentinel;
              }
              var record = tryCatch(method, delegate.iterator, context.arg);
              if (record.type === "throw") {
                context.method = "throw";
                context.arg = record.arg;
                context.delegate = null;
                return ContinueSentinel;
              }
              var info = record.arg;
              if (!info) {
                context.method = "throw";
                context.arg = new TypeError("iterator result is not an object");
                context.delegate = null;
                return ContinueSentinel;
              }
              if (info.done) {
                context[delegate.resultName] = info.value;
                context.next = delegate.nextLoc;
                if (context.method !== "return") {
                  context.method = "next";
                  context.arg = undefined;
                }
              } else {
                return info;
              }
              context.delegate = null;
              return ContinueSentinel;
            }
            defineIteratorMethods(Gp);
            Gp[toStringTagSymbol] = "Generator";
            Gp[iteratorSymbol] = function() {
              return this;
            };
            Gp.toString = function() {
              return "[object Generator]";
            };
            function pushTryEntry(locs) {
              var entry = { tryLoc: locs[0] };
              if (1 in locs) {
                entry.catchLoc = locs[1];
              }
              if (2 in locs) {
                entry.finallyLoc = locs[2];
                entry.afterLoc = locs[3];
              }
              this.tryEntries.push(entry);
            }
            function resetTryEntry(entry) {
              var record = entry.completion || {};
              record.type = "normal";
              delete record.arg;
              entry.completion = record;
            }
            function Context(tryLocsList) {
              this.tryEntries = [{ tryLoc: "root" }];
              tryLocsList.forEach(pushTryEntry, this);
              this.reset(true);
            }
            runtime.keys = function(object) {
              var keys = [];
              for (var key in object) {
                keys.push(key);
              }
              keys.reverse();
              return function next() {
                while (keys.length) {
                  var key = keys.pop();
                  if (key in object) {
                    next.value = key;
                    next.done = false;
                    return next;
                  }
                }
                next.done = true;
                return next;
              };
            };
            function values(iterable) {
              if (iterable) {
                var iteratorMethod = iterable[iteratorSymbol];
                if (iteratorMethod) {
                  return iteratorMethod.call(iterable);
                }
                if (typeof iterable.next === "function") {
                  return iterable;
                }
                if (!isNaN(iterable.length)) {
                  var i = -1,
                    next = function next() {
                      while (++i < iterable.length) {
                        if (hasOwn.call(iterable, i)) {
                          next.value = iterable[i];
                          next.done = false;
                          return next;
                        }
                      }
                      next.value = undefined;
                      next.done = true;
                      return next;
                    };
                  return (next.next = next);
                }
              }
              return { next: doneResult };
            }
            runtime.values = values;
            function doneResult() {
              return { value: undefined, done: true };
            }
            Context.prototype = {
              constructor: Context,
              reset: function(skipTempReset) {
                this.prev = 0;
                this.next = 0;
                this.sent = this._sent = undefined;
                this.done = false;
                this.delegate = null;
                this.method = "next";
                this.arg = undefined;
                this.tryEntries.forEach(resetTryEntry);
                if (!skipTempReset) {
                  for (var name in this) {
                    if (
                      name.charAt(0) === "t" &&
                      hasOwn.call(this, name) &&
                      !isNaN(+name.slice(1))
                    ) {
                      this[name] = undefined;
                    }
                  }
                }
              },
              stop: function() {
                this.done = true;
                var rootEntry = this.tryEntries[0];
                var rootRecord = rootEntry.completion;
                if (rootRecord.type === "throw") {
                  throw rootRecord.arg;
                }
                return this.rval;
              },
              dispatchException: function(exception) {
                if (this.done) {
                  throw exception;
                }
                var context = this;
                function handle(loc, caught) {
                  record.type = "throw";
                  record.arg = exception;
                  context.next = loc;
                  if (caught) {
                    context.method = "next";
                    context.arg = undefined;
                  }
                  return !!caught;
                }
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  var record = entry.completion;
                  if (entry.tryLoc === "root") {
                    return handle("end");
                  }
                  if (entry.tryLoc <= this.prev) {
                    var hasCatch = hasOwn.call(entry, "catchLoc");
                    var hasFinally = hasOwn.call(entry, "finallyLoc");
                    if (hasCatch && hasFinally) {
                      if (this.prev < entry.catchLoc) {
                        return handle(entry.catchLoc, true);
                      } else if (this.prev < entry.finallyLoc) {
                        return handle(entry.finallyLoc);
                      }
                    } else if (hasCatch) {
                      if (this.prev < entry.catchLoc) {
                        return handle(entry.catchLoc, true);
                      }
                    } else if (hasFinally) {
                      if (this.prev < entry.finallyLoc) {
                        return handle(entry.finallyLoc);
                      }
                    } else {
                      throw new Error("try statement without catch or finally");
                    }
                  }
                }
              },
              abrupt: function(type, arg) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  if (
                    entry.tryLoc <= this.prev &&
                    hasOwn.call(entry, "finallyLoc") &&
                    this.prev < entry.finallyLoc
                  ) {
                    var finallyEntry = entry;
                    break;
                  }
                }
                if (
                  finallyEntry &&
                  (type === "break" || type === "continue") &&
                  finallyEntry.tryLoc <= arg &&
                  arg <= finallyEntry.finallyLoc
                ) {
                  finallyEntry = null;
                }
                var record = finallyEntry ? finallyEntry.completion : {};
                record.type = type;
                record.arg = arg;
                if (finallyEntry) {
                  this.method = "next";
                  this.next = finallyEntry.finallyLoc;
                  return ContinueSentinel;
                }
                return this.complete(record);
              },
              complete: function(record, afterLoc) {
                if (record.type === "throw") {
                  throw record.arg;
                }
                if (record.type === "break" || record.type === "continue") {
                  this.next = record.arg;
                } else if (record.type === "return") {
                  this.rval = this.arg = record.arg;
                  this.method = "return";
                  this.next = "end";
                } else if (record.type === "normal" && afterLoc) {
                  this.next = afterLoc;
                }
                return ContinueSentinel;
              },
              finish: function(finallyLoc) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  if (entry.finallyLoc === finallyLoc) {
                    this.complete(entry.completion, entry.afterLoc);
                    resetTryEntry(entry);
                    return ContinueSentinel;
                  }
                }
              },
              catch: function(tryLoc) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  if (entry.tryLoc === tryLoc) {
                    var record = entry.completion;
                    if (record.type === "throw") {
                      var thrown = record.arg;
                      resetTryEntry(entry);
                    }
                    return thrown;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function(iterable, resultName, nextLoc) {
                this.delegate = {
                  iterator: values(iterable),
                  resultName: resultName,
                  nextLoc: nextLoc
                };
                if (this.method === "next") {
                  this.arg = undefined;
                }
                return ContinueSentinel;
              }
            };
          })(
            (function() {
              return this;
            })() || Function("return this")()
          );
        },
        {}
      ],
      49: [
        function(require, module, exports) {
          "use strict";
          var SDPUtils = require("sdp");
          function writeMediaSection(
            transceiver,
            caps,
            type,
            stream,
            dtlsRole
          ) {
            var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
            sdp += SDPUtils.writeIceParameters(
              transceiver.iceGatherer.getLocalParameters()
            );
            sdp += SDPUtils.writeDtlsParameters(
              transceiver.dtlsTransport.getLocalParameters(),
              type === "offer" ? "actpass" : dtlsRole || "active"
            );
            sdp += "a=mid:" + transceiver.mid + "\r\n";
            if (transceiver.rtpSender && transceiver.rtpReceiver) {
              sdp += "a=sendrecv\r\n";
            } else if (transceiver.rtpSender) {
              sdp += "a=sendonly\r\n";
            } else if (transceiver.rtpReceiver) {
              sdp += "a=recvonly\r\n";
            } else {
              sdp += "a=inactive\r\n";
            }
            if (transceiver.rtpSender) {
              var trackId =
                transceiver.rtpSender._initialTrackId ||
                transceiver.rtpSender.track.id;
              transceiver.rtpSender._initialTrackId = trackId;
              var msid =
                "msid:" + (stream ? stream.id : "-") + " " + trackId + "\r\n";
              sdp += "a=" + msid;
              sdp +=
                "a=ssrc:" +
                transceiver.sendEncodingParameters[0].ssrc +
                " " +
                msid;
              if (transceiver.sendEncodingParameters[0].rtx) {
                sdp +=
                  "a=ssrc:" +
                  transceiver.sendEncodingParameters[0].rtx.ssrc +
                  " " +
                  msid;
                sdp +=
                  "a=ssrc-group:FID " +
                  transceiver.sendEncodingParameters[0].ssrc +
                  " " +
                  transceiver.sendEncodingParameters[0].rtx.ssrc +
                  "\r\n";
              }
            }
            sdp +=
              "a=ssrc:" +
              transceiver.sendEncodingParameters[0].ssrc +
              " cname:" +
              SDPUtils.localCName +
              "\r\n";
            if (
              transceiver.rtpSender &&
              transceiver.sendEncodingParameters[0].rtx
            ) {
              sdp +=
                "a=ssrc:" +
                transceiver.sendEncodingParameters[0].rtx.ssrc +
                " cname:" +
                SDPUtils.localCName +
                "\r\n";
            }
            return sdp;
          }
          function filterIceServers(iceServers, edgeVersion) {
            var hasTurn = false;
            iceServers = JSON.parse(JSON.stringify(iceServers));
            return iceServers.filter(function(server) {
              if (server && (server.urls || server.url)) {
                var urls = server.urls || server.url;
                if (server.url && !server.urls) {
                  console.warn(
                    "RTCIceServer.url is deprecated! Use urls instead."
                  );
                }
                var isString = typeof urls === "string";
                if (isString) {
                  urls = [urls];
                }
                urls = urls.filter(function(url) {
                  var validTurn =
                    url.indexOf("turn:") === 0 &&
                    url.indexOf("transport=udp") !== -1 &&
                    url.indexOf("turn:[") === -1 &&
                    !hasTurn;
                  if (validTurn) {
                    hasTurn = true;
                    return true;
                  }
                  return (
                    url.indexOf("stun:") === 0 &&
                    edgeVersion >= 14393 &&
                    url.indexOf("?transport=udp") === -1
                  );
                });
                delete server.url;
                server.urls = isString ? urls[0] : urls;
                return !!urls.length;
              }
            });
          }
          function getCommonCapabilities(
            localCapabilities,
            remoteCapabilities
          ) {
            var commonCapabilities = {
              codecs: [],
              headerExtensions: [],
              fecMechanisms: []
            };
            var findCodecByPayloadType = function(pt, codecs) {
              pt = parseInt(pt, 10);
              for (var i = 0; i < codecs.length; i++) {
                if (
                  codecs[i].payloadType === pt ||
                  codecs[i].preferredPayloadType === pt
                ) {
                  return codecs[i];
                }
              }
            };
            var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
              var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
              var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
              return (
                lCodec &&
                rCodec &&
                lCodec.name.toLowerCase() === rCodec.name.toLowerCase()
              );
            };
            localCapabilities.codecs.forEach(function(lCodec) {
              for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
                var rCodec = remoteCapabilities.codecs[i];
                if (
                  lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
                  lCodec.clockRate === rCodec.clockRate
                ) {
                  if (
                    lCodec.name.toLowerCase() === "rtx" &&
                    lCodec.parameters &&
                    rCodec.parameters.apt
                  ) {
                    if (
                      !rtxCapabilityMatches(
                        lCodec,
                        rCodec,
                        localCapabilities.codecs,
                        remoteCapabilities.codecs
                      )
                    ) {
                      continue;
                    }
                  }
                  rCodec = JSON.parse(JSON.stringify(rCodec));
                  rCodec.numChannels = Math.min(
                    lCodec.numChannels,
                    rCodec.numChannels
                  );
                  commonCapabilities.codecs.push(rCodec);
                  rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(
                    fb
                  ) {
                    for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                      if (
                        lCodec.rtcpFeedback[j].type === fb.type &&
                        lCodec.rtcpFeedback[j].parameter === fb.parameter
                      ) {
                        return true;
                      }
                    }
                    return false;
                  });
                  break;
                }
              }
            });
            localCapabilities.headerExtensions.forEach(function(
              lHeaderExtension
            ) {
              for (
                var i = 0;
                i < remoteCapabilities.headerExtensions.length;
                i++
              ) {
                var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                if (lHeaderExtension.uri === rHeaderExtension.uri) {
                  commonCapabilities.headerExtensions.push(rHeaderExtension);
                  break;
                }
              }
            });
            return commonCapabilities;
          }
          function isActionAllowedInSignalingState(
            action,
            type,
            signalingState
          ) {
            return (
              {
                offer: {
                  setLocalDescription: ["stable", "have-local-offer"],
                  setRemoteDescription: ["stable", "have-remote-offer"]
                },
                answer: {
                  setLocalDescription: [
                    "have-remote-offer",
                    "have-local-pranswer"
                  ],
                  setRemoteDescription: [
                    "have-local-offer",
                    "have-remote-pranswer"
                  ]
                }
              }[type][action].indexOf(signalingState) !== -1
            );
          }
          function maybeAddCandidate(iceTransport, candidate) {
            var alreadyAdded = iceTransport
              .getRemoteCandidates()
              .find(function(remoteCandidate) {
                return (
                  candidate.foundation === remoteCandidate.foundation &&
                  candidate.ip === remoteCandidate.ip &&
                  candidate.port === remoteCandidate.port &&
                  candidate.priority === remoteCandidate.priority &&
                  candidate.protocol === remoteCandidate.protocol &&
                  candidate.type === remoteCandidate.type
                );
              });
            if (!alreadyAdded) {
              iceTransport.addRemoteCandidate(candidate);
            }
            return !alreadyAdded;
          }
          function makeError(name, description) {
            var e = new Error(description);
            e.name = name;
            return e;
          }
          module.exports = function(window, edgeVersion) {
            function addTrackToStreamAndFireEvent(track, stream) {
              stream.addTrack(track);
              stream.dispatchEvent(
                new window.MediaStreamTrackEvent("addtrack", { track: track })
              );
            }
            function removeTrackFromStreamAndFireEvent(track, stream) {
              stream.removeTrack(track);
              stream.dispatchEvent(
                new window.MediaStreamTrackEvent("removetrack", {
                  track: track
                })
              );
            }
            function fireAddTrack(pc, track, receiver, streams) {
              var trackEvent = new Event("track");
              trackEvent.track = track;
              trackEvent.receiver = receiver;
              trackEvent.transceiver = { receiver: receiver };
              trackEvent.streams = streams;
              window.setTimeout(function() {
                pc._dispatchEvent("track", trackEvent);
              });
            }
            var RTCPeerConnection = function(config) {
              var pc = this;
              var _eventTarget = document.createDocumentFragment();
              [
                "addEventListener",
                "removeEventListener",
                "dispatchEvent"
              ].forEach(function(method) {
                pc[method] = _eventTarget[method].bind(_eventTarget);
              });
              this.canTrickleIceCandidates = null;
              this.needNegotiation = false;
              this.localStreams = [];
              this.remoteStreams = [];
              this.localDescription = null;
              this.remoteDescription = null;
              this.signalingState = "stable";
              this.iceConnectionState = "new";
              this.iceGatheringState = "new";
              config = JSON.parse(JSON.stringify(config || {}));
              this.usingBundle = config.bundlePolicy === "max-bundle";
              if (config.rtcpMuxPolicy === "negotiate") {
                throw makeError(
                  "NotSupportedError",
                  "rtcpMuxPolicy 'negotiate' is not supported"
                );
              } else if (!config.rtcpMuxPolicy) {
                config.rtcpMuxPolicy = "require";
              }
              switch (config.iceTransportPolicy) {
                case "all":
                case "relay":
                  break;
                default:
                  config.iceTransportPolicy = "all";
                  break;
              }
              switch (config.bundlePolicy) {
                case "balanced":
                case "max-compat":
                case "max-bundle":
                  break;
                default:
                  config.bundlePolicy = "balanced";
                  break;
              }
              config.iceServers = filterIceServers(
                config.iceServers || [],
                edgeVersion
              );
              this._iceGatherers = [];
              if (config.iceCandidatePoolSize) {
                for (var i = config.iceCandidatePoolSize; i > 0; i--) {
                  this._iceGatherers.push(
                    new window.RTCIceGatherer({
                      iceServers: config.iceServers,
                      gatherPolicy: config.iceTransportPolicy
                    })
                  );
                }
              } else {
                config.iceCandidatePoolSize = 0;
              }
              this._config = config;
              this.transceivers = [];
              this._sdpSessionId = SDPUtils.generateSessionId();
              this._sdpSessionVersion = 0;
              this._dtlsRole = undefined;
              this._isClosed = false;
            };
            RTCPeerConnection.prototype.onicecandidate = null;
            RTCPeerConnection.prototype.onaddstream = null;
            RTCPeerConnection.prototype.ontrack = null;
            RTCPeerConnection.prototype.onremovestream = null;
            RTCPeerConnection.prototype.onsignalingstatechange = null;
            RTCPeerConnection.prototype.oniceconnectionstatechange = null;
            RTCPeerConnection.prototype.onicegatheringstatechange = null;
            RTCPeerConnection.prototype.onnegotiationneeded = null;
            RTCPeerConnection.prototype.ondatachannel = null;
            RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
              if (this._isClosed) {
                return;
              }
              this.dispatchEvent(event);
              if (typeof this["on" + name] === "function") {
                this["on" + name](event);
              }
            };
            RTCPeerConnection.prototype._emitGatheringStateChange = function() {
              var event = new Event("icegatheringstatechange");
              this._dispatchEvent("icegatheringstatechange", event);
            };
            RTCPeerConnection.prototype.getConfiguration = function() {
              return this._config;
            };
            RTCPeerConnection.prototype.getLocalStreams = function() {
              return this.localStreams;
            };
            RTCPeerConnection.prototype.getRemoteStreams = function() {
              return this.remoteStreams;
            };
            RTCPeerConnection.prototype._createTransceiver = function(kind) {
              var hasBundleTransport = this.transceivers.length > 0;
              var transceiver = {
                track: null,
                iceGatherer: null,
                iceTransport: null,
                dtlsTransport: null,
                localCapabilities: null,
                remoteCapabilities: null,
                rtpSender: null,
                rtpReceiver: null,
                kind: kind,
                mid: null,
                sendEncodingParameters: null,
                recvEncodingParameters: null,
                stream: null,
                associatedRemoteMediaStreams: [],
                wantReceive: true
              };
              if (this.usingBundle && hasBundleTransport) {
                transceiver.iceTransport = this.transceivers[0].iceTransport;
                transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
              } else {
                var transports = this._createIceAndDtlsTransports();
                transceiver.iceTransport = transports.iceTransport;
                transceiver.dtlsTransport = transports.dtlsTransport;
              }
              this.transceivers.push(transceiver);
              return transceiver;
            };
            RTCPeerConnection.prototype.addTrack = function(track, stream) {
              if (this._isClosed) {
                throw makeError(
                  "InvalidStateError",
                  "Attempted to call addTrack on a closed peerconnection."
                );
              }
              var alreadyExists = this.transceivers.find(function(s) {
                return s.track === track;
              });
              if (alreadyExists) {
                throw makeError("InvalidAccessError", "Track already exists.");
              }
              var transceiver;
              for (var i = 0; i < this.transceivers.length; i++) {
                if (
                  !this.transceivers[i].track &&
                  this.transceivers[i].kind === track.kind
                ) {
                  transceiver = this.transceivers[i];
                }
              }
              if (!transceiver) {
                transceiver = this._createTransceiver(track.kind);
              }
              this._maybeFireNegotiationNeeded();
              if (this.localStreams.indexOf(stream) === -1) {
                this.localStreams.push(stream);
              }
              transceiver.track = track;
              transceiver.stream = stream;
              transceiver.rtpSender = new window.RTCRtpSender(
                track,
                transceiver.dtlsTransport
              );
              return transceiver.rtpSender;
            };
            RTCPeerConnection.prototype.addStream = function(stream) {
              var pc = this;
              if (edgeVersion >= 15025) {
                stream.getTracks().forEach(function(track) {
                  pc.addTrack(track, stream);
                });
              } else {
                var clonedStream = stream.clone();
                stream.getTracks().forEach(function(track, idx) {
                  var clonedTrack = clonedStream.getTracks()[idx];
                  track.addEventListener("enabled", function(event) {
                    clonedTrack.enabled = event.enabled;
                  });
                });
                clonedStream.getTracks().forEach(function(track) {
                  pc.addTrack(track, clonedStream);
                });
              }
            };
            RTCPeerConnection.prototype.removeTrack = function(sender) {
              if (this._isClosed) {
                throw makeError(
                  "InvalidStateError",
                  "Attempted to call removeTrack on a closed peerconnection."
                );
              }
              if (!(sender instanceof window.RTCRtpSender)) {
                throw new TypeError(
                  "Argument 1 of RTCPeerConnection.removeTrack " +
                    "does not implement interface RTCRtpSender."
                );
              }
              var transceiver = this.transceivers.find(function(t) {
                return t.rtpSender === sender;
              });
              if (!transceiver) {
                throw makeError(
                  "InvalidAccessError",
                  "Sender was not created by this connection."
                );
              }
              var stream = transceiver.stream;
              transceiver.rtpSender.stop();
              transceiver.rtpSender = null;
              transceiver.track = null;
              transceiver.stream = null;
              var localStreams = this.transceivers.map(function(t) {
                return t.stream;
              });
              if (
                localStreams.indexOf(stream) === -1 &&
                this.localStreams.indexOf(stream) > -1
              ) {
                this.localStreams.splice(this.localStreams.indexOf(stream), 1);
              }
              this._maybeFireNegotiationNeeded();
            };
            RTCPeerConnection.prototype.removeStream = function(stream) {
              var pc = this;
              stream.getTracks().forEach(function(track) {
                var sender = pc.getSenders().find(function(s) {
                  return s.track === track;
                });
                if (sender) {
                  pc.removeTrack(sender);
                }
              });
            };
            RTCPeerConnection.prototype.getSenders = function() {
              return this.transceivers
                .filter(function(transceiver) {
                  return !!transceiver.rtpSender;
                })
                .map(function(transceiver) {
                  return transceiver.rtpSender;
                });
            };
            RTCPeerConnection.prototype.getReceivers = function() {
              return this.transceivers
                .filter(function(transceiver) {
                  return !!transceiver.rtpReceiver;
                })
                .map(function(transceiver) {
                  return transceiver.rtpReceiver;
                });
            };
            RTCPeerConnection.prototype._createIceGatherer = function(
              sdpMLineIndex,
              usingBundle
            ) {
              var pc = this;
              if (usingBundle && sdpMLineIndex > 0) {
                return this.transceivers[0].iceGatherer;
              } else if (this._iceGatherers.length) {
                return this._iceGatherers.shift();
              }
              var iceGatherer = new window.RTCIceGatherer({
                iceServers: this._config.iceServers,
                gatherPolicy: this._config.iceTransportPolicy
              });
              Object.defineProperty(iceGatherer, "state", {
                value: "new",
                writable: true
              });
              this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
              this.transceivers[sdpMLineIndex].bufferCandidates = function(
                event
              ) {
                var end =
                  !event.candidate || Object.keys(event.candidate).length === 0;
                iceGatherer.state = end ? "completed" : "gathering";
                if (
                  pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !==
                  null
                ) {
                  pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(
                    event
                  );
                }
              };
              iceGatherer.addEventListener(
                "localcandidate",
                this.transceivers[sdpMLineIndex].bufferCandidates
              );
              return iceGatherer;
            };
            RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
              var pc = this;
              var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
              if (iceGatherer.onlocalcandidate) {
                return;
              }
              var bufferedCandidateEvents = this.transceivers[sdpMLineIndex]
                .bufferedCandidateEvents;
              this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
              iceGatherer.removeEventListener(
                "localcandidate",
                this.transceivers[sdpMLineIndex].bufferCandidates
              );
              iceGatherer.onlocalcandidate = function(evt) {
                if (pc.usingBundle && sdpMLineIndex > 0) {
                  return;
                }
                var event = new Event("icecandidate");
                event.candidate = { sdpMid: mid, sdpMLineIndex: sdpMLineIndex };
                var cand = evt.candidate;
                var end = !cand || Object.keys(cand).length === 0;
                if (end) {
                  if (
                    iceGatherer.state === "new" ||
                    iceGatherer.state === "gathering"
                  ) {
                    iceGatherer.state = "completed";
                  }
                } else {
                  if (iceGatherer.state === "new") {
                    iceGatherer.state = "gathering";
                  }
                  cand.component = 1;
                  var serializedCandidate = SDPUtils.writeCandidate(cand);
                  event.candidate = Object.assign(
                    event.candidate,
                    SDPUtils.parseCandidate(serializedCandidate)
                  );
                  event.candidate.candidate = serializedCandidate;
                }
                var sections = SDPUtils.getMediaSections(
                  pc.localDescription.sdp
                );
                if (!end) {
                  sections[event.candidate.sdpMLineIndex] +=
                    "a=" + event.candidate.candidate + "\r\n";
                } else {
                  sections[event.candidate.sdpMLineIndex] +=
                    "a=end-of-candidates\r\n";
                }
                pc.localDescription.sdp =
                  SDPUtils.getDescription(pc.localDescription.sdp) +
                  sections.join("");
                var complete = pc.transceivers.every(function(transceiver) {
                  return (
                    transceiver.iceGatherer &&
                    transceiver.iceGatherer.state === "completed"
                  );
                });
                if (pc.iceGatheringState !== "gathering") {
                  pc.iceGatheringState = "gathering";
                  pc._emitGatheringStateChange();
                }
                if (!end) {
                  pc._dispatchEvent("icecandidate", event);
                }
                if (complete) {
                  pc._dispatchEvent("icecandidate", new Event("icecandidate"));
                  pc.iceGatheringState = "complete";
                  pc._emitGatheringStateChange();
                }
              };
              window.setTimeout(function() {
                bufferedCandidateEvents.forEach(function(e) {
                  iceGatherer.onlocalcandidate(e);
                });
              }, 0);
            };
            RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
              var pc = this;
              var iceTransport = new window.RTCIceTransport(null);
              iceTransport.onicestatechange = function() {
                pc._updateConnectionState();
              };
              var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
              dtlsTransport.ondtlsstatechange = function() {
                pc._updateConnectionState();
              };
              dtlsTransport.onerror = function() {
                Object.defineProperty(dtlsTransport, "state", {
                  value: "failed",
                  writable: true
                });
                pc._updateConnectionState();
              };
              return {
                iceTransport: iceTransport,
                dtlsTransport: dtlsTransport
              };
            };
            RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
              sdpMLineIndex
            ) {
              var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
              if (iceGatherer) {
                delete iceGatherer.onlocalcandidate;
                delete this.transceivers[sdpMLineIndex].iceGatherer;
              }
              var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
              if (iceTransport) {
                delete iceTransport.onicestatechange;
                delete this.transceivers[sdpMLineIndex].iceTransport;
              }
              var dtlsTransport = this.transceivers[sdpMLineIndex]
                .dtlsTransport;
              if (dtlsTransport) {
                delete dtlsTransport.ondtlsstatechange;
                delete dtlsTransport.onerror;
                delete this.transceivers[sdpMLineIndex].dtlsTransport;
              }
            };
            RTCPeerConnection.prototype._transceive = function(
              transceiver,
              send,
              recv
            ) {
              var params = getCommonCapabilities(
                transceiver.localCapabilities,
                transceiver.remoteCapabilities
              );
              if (send && transceiver.rtpSender) {
                params.encodings = transceiver.sendEncodingParameters;
                params.rtcp = {
                  cname: SDPUtils.localCName,
                  compound: transceiver.rtcpParameters.compound
                };
                if (transceiver.recvEncodingParameters.length) {
                  params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
                }
                transceiver.rtpSender.send(params);
              }
              if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
                if (
                  transceiver.kind === "video" &&
                  transceiver.recvEncodingParameters &&
                  edgeVersion < 15019
                ) {
                  transceiver.recvEncodingParameters.forEach(function(p) {
                    delete p.rtx;
                  });
                }
                if (transceiver.recvEncodingParameters.length) {
                  params.encodings = transceiver.recvEncodingParameters;
                } else {
                  params.encodings = [{}];
                }
                params.rtcp = { compound: transceiver.rtcpParameters.compound };
                if (transceiver.rtcpParameters.cname) {
                  params.rtcp.cname = transceiver.rtcpParameters.cname;
                }
                if (transceiver.sendEncodingParameters.length) {
                  params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
                }
                transceiver.rtpReceiver.receive(params);
              }
            };
            RTCPeerConnection.prototype.setLocalDescription = function(
              description
            ) {
              var pc = this;
              if (["offer", "answer"].indexOf(description.type) === -1) {
                return Promise.reject(
                  makeError(
                    "TypeError",
                    'Unsupported type "' + description.type + '"'
                  )
                );
              }
              if (
                !isActionAllowedInSignalingState(
                  "setLocalDescription",
                  description.type,
                  pc.signalingState
                ) ||
                pc._isClosed
              ) {
                return Promise.reject(
                  makeError(
                    "InvalidStateError",
                    "Can not set local " +
                      description.type +
                      " in state " +
                      pc.signalingState
                  )
                );
              }
              var sections;
              var sessionpart;
              if (description.type === "offer") {
                sections = SDPUtils.splitSections(description.sdp);
                sessionpart = sections.shift();
                sections.forEach(function(mediaSection, sdpMLineIndex) {
                  var caps = SDPUtils.parseRtpParameters(mediaSection);
                  pc.transceivers[sdpMLineIndex].localCapabilities = caps;
                });
                pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                  pc._gather(transceiver.mid, sdpMLineIndex);
                });
              } else if (description.type === "answer") {
                sections = SDPUtils.splitSections(pc.remoteDescription.sdp);
                sessionpart = sections.shift();
                var isIceLite =
                  SDPUtils.matchPrefix(sessionpart, "a=ice-lite").length > 0;
                sections.forEach(function(mediaSection, sdpMLineIndex) {
                  var transceiver = pc.transceivers[sdpMLineIndex];
                  var iceGatherer = transceiver.iceGatherer;
                  var iceTransport = transceiver.iceTransport;
                  var dtlsTransport = transceiver.dtlsTransport;
                  var localCapabilities = transceiver.localCapabilities;
                  var remoteCapabilities = transceiver.remoteCapabilities;
                  var rejected =
                    SDPUtils.isRejected(mediaSection) &&
                    SDPUtils.matchPrefix(mediaSection, "a=bundle-only")
                      .length === 0;
                  if (!rejected && !transceiver.isDatachannel) {
                    var remoteIceParameters = SDPUtils.getIceParameters(
                      mediaSection,
                      sessionpart
                    );
                    var remoteDtlsParameters = SDPUtils.getDtlsParameters(
                      mediaSection,
                      sessionpart
                    );
                    if (isIceLite) {
                      remoteDtlsParameters.role = "server";
                    }
                    if (!pc.usingBundle || sdpMLineIndex === 0) {
                      pc._gather(transceiver.mid, sdpMLineIndex);
                      if (iceTransport.state === "new") {
                        iceTransport.start(
                          iceGatherer,
                          remoteIceParameters,
                          isIceLite ? "controlling" : "controlled"
                        );
                      }
                      if (dtlsTransport.state === "new") {
                        dtlsTransport.start(remoteDtlsParameters);
                      }
                    }
                    var params = getCommonCapabilities(
                      localCapabilities,
                      remoteCapabilities
                    );
                    pc._transceive(
                      transceiver,
                      params.codecs.length > 0,
                      false
                    );
                  }
                });
              }
              pc.localDescription = {
                type: description.type,
                sdp: description.sdp
              };
              if (description.type === "offer") {
                pc._updateSignalingState("have-local-offer");
              } else {
                pc._updateSignalingState("stable");
              }
              return Promise.resolve();
            };
            RTCPeerConnection.prototype.setRemoteDescription = function(
              description
            ) {
              var pc = this;
              if (["offer", "answer"].indexOf(description.type) === -1) {
                return Promise.reject(
                  makeError(
                    "TypeError",
                    'Unsupported type "' + description.type + '"'
                  )
                );
              }
              if (
                !isActionAllowedInSignalingState(
                  "setRemoteDescription",
                  description.type,
                  pc.signalingState
                ) ||
                pc._isClosed
              ) {
                return Promise.reject(
                  makeError(
                    "InvalidStateError",
                    "Can not set remote " +
                      description.type +
                      " in state " +
                      pc.signalingState
                  )
                );
              }
              var streams = {};
              pc.remoteStreams.forEach(function(stream) {
                streams[stream.id] = stream;
              });
              var receiverList = [];
              var sections = SDPUtils.splitSections(description.sdp);
              var sessionpart = sections.shift();
              var isIceLite =
                SDPUtils.matchPrefix(sessionpart, "a=ice-lite").length > 0;
              var usingBundle =
                SDPUtils.matchPrefix(sessionpart, "a=group:BUNDLE ").length > 0;
              pc.usingBundle = usingBundle;
              var iceOptions = SDPUtils.matchPrefix(
                sessionpart,
                "a=ice-options:"
              )[0];
              if (iceOptions) {
                pc.canTrickleIceCandidates =
                  iceOptions
                    .substr(14)
                    .split(" ")
                    .indexOf("trickle") >= 0;
              } else {
                pc.canTrickleIceCandidates = false;
              }
              sections.forEach(function(mediaSection, sdpMLineIndex) {
                var lines = SDPUtils.splitLines(mediaSection);
                var kind = SDPUtils.getKind(mediaSection);
                var rejected =
                  SDPUtils.isRejected(mediaSection) &&
                  SDPUtils.matchPrefix(mediaSection, "a=bundle-only").length ===
                    0;
                var protocol = lines[0].substr(2).split(" ")[2];
                var direction = SDPUtils.getDirection(
                  mediaSection,
                  sessionpart
                );
                var remoteMsid = SDPUtils.parseMsid(mediaSection);
                var mid =
                  SDPUtils.getMid(mediaSection) ||
                  SDPUtils.generateIdentifier();
                if (kind === "application" && protocol === "DTLS/SCTP") {
                  pc.transceivers[sdpMLineIndex] = {
                    mid: mid,
                    isDatachannel: true
                  };
                  return;
                }
                var transceiver;
                var iceGatherer;
                var iceTransport;
                var dtlsTransport;
                var rtpReceiver;
                var sendEncodingParameters;
                var recvEncodingParameters;
                var localCapabilities;
                var track;
                var remoteCapabilities = SDPUtils.parseRtpParameters(
                  mediaSection
                );
                var remoteIceParameters;
                var remoteDtlsParameters;
                if (!rejected) {
                  remoteIceParameters = SDPUtils.getIceParameters(
                    mediaSection,
                    sessionpart
                  );
                  remoteDtlsParameters = SDPUtils.getDtlsParameters(
                    mediaSection,
                    sessionpart
                  );
                  remoteDtlsParameters.role = "client";
                }
                recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(
                  mediaSection
                );
                var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
                var isComplete =
                  SDPUtils.matchPrefix(
                    mediaSection,
                    "a=end-of-candidates",
                    sessionpart
                  ).length > 0;
                var cands = SDPUtils.matchPrefix(mediaSection, "a=candidate:")
                  .map(function(cand) {
                    return SDPUtils.parseCandidate(cand);
                  })
                  .filter(function(cand) {
                    return cand.component === 1;
                  });
                if (
                  (description.type === "offer" ||
                    description.type === "answer") &&
                  !rejected &&
                  usingBundle &&
                  sdpMLineIndex > 0 &&
                  pc.transceivers[sdpMLineIndex]
                ) {
                  pc._disposeIceAndDtlsTransports(sdpMLineIndex);
                  pc.transceivers[sdpMLineIndex].iceGatherer =
                    pc.transceivers[0].iceGatherer;
                  pc.transceivers[sdpMLineIndex].iceTransport =
                    pc.transceivers[0].iceTransport;
                  pc.transceivers[sdpMLineIndex].dtlsTransport =
                    pc.transceivers[0].dtlsTransport;
                  if (pc.transceivers[sdpMLineIndex].rtpSender) {
                    pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
                      pc.transceivers[0].dtlsTransport
                    );
                  }
                  if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
                    pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
                      pc.transceivers[0].dtlsTransport
                    );
                  }
                }
                if (description.type === "offer" && !rejected) {
                  transceiver =
                    pc.transceivers[sdpMLineIndex] ||
                    pc._createTransceiver(kind);
                  transceiver.mid = mid;
                  if (!transceiver.iceGatherer) {
                    transceiver.iceGatherer = pc._createIceGatherer(
                      sdpMLineIndex,
                      usingBundle
                    );
                  }
                  if (
                    cands.length &&
                    transceiver.iceTransport.state === "new"
                  ) {
                    if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                      transceiver.iceTransport.setRemoteCandidates(cands);
                    } else {
                      cands.forEach(function(candidate) {
                        maybeAddCandidate(transceiver.iceTransport, candidate);
                      });
                    }
                  }
                  localCapabilities = window.RTCRtpReceiver.getCapabilities(
                    kind
                  );
                  if (edgeVersion < 15019) {
                    localCapabilities.codecs = localCapabilities.codecs.filter(
                      function(codec) {
                        return codec.name !== "rtx";
                      }
                    );
                  }
                  sendEncodingParameters = transceiver.sendEncodingParameters || [
                    { ssrc: (2 * sdpMLineIndex + 2) * 1001 }
                  ];
                  var isNewTrack = false;
                  if (direction === "sendrecv" || direction === "sendonly") {
                    isNewTrack = !transceiver.rtpReceiver;
                    rtpReceiver =
                      transceiver.rtpReceiver ||
                      new window.RTCRtpReceiver(
                        transceiver.dtlsTransport,
                        kind
                      );
                    if (isNewTrack) {
                      var stream;
                      track = rtpReceiver.track;
                      if (remoteMsid && remoteMsid.stream === "-") {
                      } else if (remoteMsid) {
                        if (!streams[remoteMsid.stream]) {
                          streams[remoteMsid.stream] = new window.MediaStream();
                          Object.defineProperty(
                            streams[remoteMsid.stream],
                            "id",
                            {
                              get: function() {
                                return remoteMsid.stream;
                              }
                            }
                          );
                        }
                        Object.defineProperty(track, "id", {
                          get: function() {
                            return remoteMsid.track;
                          }
                        });
                        stream = streams[remoteMsid.stream];
                      } else {
                        if (!streams.default) {
                          streams.default = new window.MediaStream();
                        }
                        stream = streams.default;
                      }
                      if (stream) {
                        addTrackToStreamAndFireEvent(track, stream);
                        transceiver.associatedRemoteMediaStreams.push(stream);
                      }
                      receiverList.push([track, rtpReceiver, stream]);
                    }
                  } else if (
                    transceiver.rtpReceiver &&
                    transceiver.rtpReceiver.track
                  ) {
                    transceiver.associatedRemoteMediaStreams.forEach(function(
                      s
                    ) {
                      var nativeTrack = s.getTracks().find(function(t) {
                        return t.id === transceiver.rtpReceiver.track.id;
                      });
                      if (nativeTrack) {
                        removeTrackFromStreamAndFireEvent(nativeTrack, s);
                      }
                    });
                    transceiver.associatedRemoteMediaStreams = [];
                  }
                  transceiver.localCapabilities = localCapabilities;
                  transceiver.remoteCapabilities = remoteCapabilities;
                  transceiver.rtpReceiver = rtpReceiver;
                  transceiver.rtcpParameters = rtcpParameters;
                  transceiver.sendEncodingParameters = sendEncodingParameters;
                  transceiver.recvEncodingParameters = recvEncodingParameters;
                  pc._transceive(
                    pc.transceivers[sdpMLineIndex],
                    false,
                    isNewTrack
                  );
                } else if (description.type === "answer" && !rejected) {
                  transceiver = pc.transceivers[sdpMLineIndex];
                  iceGatherer = transceiver.iceGatherer;
                  iceTransport = transceiver.iceTransport;
                  dtlsTransport = transceiver.dtlsTransport;
                  rtpReceiver = transceiver.rtpReceiver;
                  sendEncodingParameters = transceiver.sendEncodingParameters;
                  localCapabilities = transceiver.localCapabilities;
                  pc.transceivers[
                    sdpMLineIndex
                  ].recvEncodingParameters = recvEncodingParameters;
                  pc.transceivers[
                    sdpMLineIndex
                  ].remoteCapabilities = remoteCapabilities;
                  pc.transceivers[
                    sdpMLineIndex
                  ].rtcpParameters = rtcpParameters;
                  if (cands.length && iceTransport.state === "new") {
                    if (
                      (isIceLite || isComplete) &&
                      (!usingBundle || sdpMLineIndex === 0)
                    ) {
                      iceTransport.setRemoteCandidates(cands);
                    } else {
                      cands.forEach(function(candidate) {
                        maybeAddCandidate(transceiver.iceTransport, candidate);
                      });
                    }
                  }
                  if (!usingBundle || sdpMLineIndex === 0) {
                    if (iceTransport.state === "new") {
                      iceTransport.start(
                        iceGatherer,
                        remoteIceParameters,
                        "controlling"
                      );
                    }
                    if (dtlsTransport.state === "new") {
                      dtlsTransport.start(remoteDtlsParameters);
                    }
                  }
                  pc._transceive(
                    transceiver,
                    direction === "sendrecv" || direction === "recvonly",
                    direction === "sendrecv" || direction === "sendonly"
                  );
                  if (
                    rtpReceiver &&
                    (direction === "sendrecv" || direction === "sendonly")
                  ) {
                    track = rtpReceiver.track;
                    if (remoteMsid) {
                      if (!streams[remoteMsid.stream]) {
                        streams[remoteMsid.stream] = new window.MediaStream();
                      }
                      addTrackToStreamAndFireEvent(
                        track,
                        streams[remoteMsid.stream]
                      );
                      receiverList.push([
                        track,
                        rtpReceiver,
                        streams[remoteMsid.stream]
                      ]);
                    } else {
                      if (!streams.default) {
                        streams.default = new window.MediaStream();
                      }
                      addTrackToStreamAndFireEvent(track, streams.default);
                      receiverList.push([track, rtpReceiver, streams.default]);
                    }
                  } else {
                    delete transceiver.rtpReceiver;
                  }
                }
              });
              if (pc._dtlsRole === undefined) {
                pc._dtlsRole =
                  description.type === "offer" ? "active" : "passive";
              }
              pc.remoteDescription = {
                type: description.type,
                sdp: description.sdp
              };
              if (description.type === "offer") {
                pc._updateSignalingState("have-remote-offer");
              } else {
                pc._updateSignalingState("stable");
              }
              Object.keys(streams).forEach(function(sid) {
                var stream = streams[sid];
                if (stream.getTracks().length) {
                  if (pc.remoteStreams.indexOf(stream) === -1) {
                    pc.remoteStreams.push(stream);
                    var event = new Event("addstream");
                    event.stream = stream;
                    window.setTimeout(function() {
                      pc._dispatchEvent("addstream", event);
                    });
                  }
                  receiverList.forEach(function(item) {
                    var track = item[0];
                    var receiver = item[1];
                    if (stream.id !== item[2].id) {
                      return;
                    }
                    fireAddTrack(pc, track, receiver, [stream]);
                  });
                }
              });
              receiverList.forEach(function(item) {
                if (item[2]) {
                  return;
                }
                fireAddTrack(pc, item[0], item[1], []);
              });
              window.setTimeout(function() {
                if (!(pc && pc.transceivers)) {
                  return;
                }
                pc.transceivers.forEach(function(transceiver) {
                  if (
                    transceiver.iceTransport &&
                    transceiver.iceTransport.state === "new" &&
                    transceiver.iceTransport.getRemoteCandidates().length > 0
                  ) {
                    console.warn(
                      "Timeout for addRemoteCandidate. Consider sending " +
                        "an end-of-candidates notification"
                    );
                    transceiver.iceTransport.addRemoteCandidate({});
                  }
                });
              }, 4e3);
              return Promise.resolve();
            };
            RTCPeerConnection.prototype.close = function() {
              this.transceivers.forEach(function(transceiver) {
                if (transceiver.iceTransport) {
                  transceiver.iceTransport.stop();
                }
                if (transceiver.dtlsTransport) {
                  transceiver.dtlsTransport.stop();
                }
                if (transceiver.rtpSender) {
                  transceiver.rtpSender.stop();
                }
                if (transceiver.rtpReceiver) {
                  transceiver.rtpReceiver.stop();
                }
              });
              this._isClosed = true;
              this._updateSignalingState("closed");
            };
            RTCPeerConnection.prototype._updateSignalingState = function(
              newState
            ) {
              this.signalingState = newState;
              var event = new Event("signalingstatechange");
              this._dispatchEvent("signalingstatechange", event);
            };
            RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
              var pc = this;
              if (
                this.signalingState !== "stable" ||
                this.needNegotiation === true
              ) {
                return;
              }
              this.needNegotiation = true;
              window.setTimeout(function() {
                if (pc.needNegotiation) {
                  pc.needNegotiation = false;
                  var event = new Event("negotiationneeded");
                  pc._dispatchEvent("negotiationneeded", event);
                }
              }, 0);
            };
            RTCPeerConnection.prototype._updateConnectionState = function() {
              var newState;
              var states = {
                new: 0,
                closed: 0,
                connecting: 0,
                checking: 0,
                connected: 0,
                completed: 0,
                disconnected: 0,
                failed: 0
              };
              this.transceivers.forEach(function(transceiver) {
                states[transceiver.iceTransport.state]++;
                states[transceiver.dtlsTransport.state]++;
              });
              states.connected += states.completed;
              newState = "new";
              if (states.failed > 0) {
                newState = "failed";
              } else if (states.connecting > 0 || states.checking > 0) {
                newState = "connecting";
              } else if (states.disconnected > 0) {
                newState = "disconnected";
              } else if (states.new > 0) {
                newState = "new";
              } else if (states.connected > 0 || states.completed > 0) {
                newState = "connected";
              }
              if (newState !== this.iceConnectionState) {
                this.iceConnectionState = newState;
                var event = new Event("iceconnectionstatechange");
                this._dispatchEvent("iceconnectionstatechange", event);
              }
            };
            RTCPeerConnection.prototype.createOffer = function() {
              var pc = this;
              if (pc._isClosed) {
                return Promise.reject(
                  makeError(
                    "InvalidStateError",
                    "Can not call createOffer after close"
                  )
                );
              }
              var numAudioTracks = pc.transceivers.filter(function(t) {
                return t.kind === "audio";
              }).length;
              var numVideoTracks = pc.transceivers.filter(function(t) {
                return t.kind === "video";
              }).length;
              var offerOptions = arguments[0];
              if (offerOptions) {
                if (offerOptions.mandatory || offerOptions.optional) {
                  throw new TypeError(
                    "Legacy mandatory/optional constraints not supported."
                  );
                }
                if (offerOptions.offerToReceiveAudio !== undefined) {
                  if (offerOptions.offerToReceiveAudio === true) {
                    numAudioTracks = 1;
                  } else if (offerOptions.offerToReceiveAudio === false) {
                    numAudioTracks = 0;
                  } else {
                    numAudioTracks = offerOptions.offerToReceiveAudio;
                  }
                }
                if (offerOptions.offerToReceiveVideo !== undefined) {
                  if (offerOptions.offerToReceiveVideo === true) {
                    numVideoTracks = 1;
                  } else if (offerOptions.offerToReceiveVideo === false) {
                    numVideoTracks = 0;
                  } else {
                    numVideoTracks = offerOptions.offerToReceiveVideo;
                  }
                }
              }
              pc.transceivers.forEach(function(transceiver) {
                if (transceiver.kind === "audio") {
                  numAudioTracks--;
                  if (numAudioTracks < 0) {
                    transceiver.wantReceive = false;
                  }
                } else if (transceiver.kind === "video") {
                  numVideoTracks--;
                  if (numVideoTracks < 0) {
                    transceiver.wantReceive = false;
                  }
                }
              });
              while (numAudioTracks > 0 || numVideoTracks > 0) {
                if (numAudioTracks > 0) {
                  pc._createTransceiver("audio");
                  numAudioTracks--;
                }
                if (numVideoTracks > 0) {
                  pc._createTransceiver("video");
                  numVideoTracks--;
                }
              }
              var sdp = SDPUtils.writeSessionBoilerplate(
                pc._sdpSessionId,
                pc._sdpSessionVersion++
              );
              pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                var track = transceiver.track;
                var kind = transceiver.kind;
                var mid = transceiver.mid || SDPUtils.generateIdentifier();
                transceiver.mid = mid;
                if (!transceiver.iceGatherer) {
                  transceiver.iceGatherer = pc._createIceGatherer(
                    sdpMLineIndex,
                    pc.usingBundle
                  );
                }
                var localCapabilities = window.RTCRtpSender.getCapabilities(
                  kind
                );
                if (edgeVersion < 15019) {
                  localCapabilities.codecs = localCapabilities.codecs.filter(
                    function(codec) {
                      return codec.name !== "rtx";
                    }
                  );
                }
                localCapabilities.codecs.forEach(function(codec) {
                  if (
                    codec.name === "H264" &&
                    codec.parameters["level-asymmetry-allowed"] === undefined
                  ) {
                    codec.parameters["level-asymmetry-allowed"] = "1";
                  }
                  if (
                    transceiver.remoteCapabilities &&
                    transceiver.remoteCapabilities.codecs
                  ) {
                    transceiver.remoteCapabilities.codecs.forEach(function(
                      remoteCodec
                    ) {
                      if (
                        codec.name.toLowerCase() ===
                          remoteCodec.name.toLowerCase() &&
                        codec.clockRate === remoteCodec.clockRate
                      ) {
                        codec.preferredPayloadType = remoteCodec.payloadType;
                      }
                    });
                  }
                });
                localCapabilities.headerExtensions.forEach(function(hdrExt) {
                  var remoteExtensions =
                    (transceiver.remoteCapabilities &&
                      transceiver.remoteCapabilities.headerExtensions) ||
                    [];
                  remoteExtensions.forEach(function(rHdrExt) {
                    if (hdrExt.uri === rHdrExt.uri) {
                      hdrExt.id = rHdrExt.id;
                    }
                  });
                });
                var sendEncodingParameters = transceiver.sendEncodingParameters || [
                  { ssrc: (2 * sdpMLineIndex + 1) * 1001 }
                ];
                if (track) {
                  if (
                    edgeVersion >= 15019 &&
                    kind === "video" &&
                    !sendEncodingParameters[0].rtx
                  ) {
                    sendEncodingParameters[0].rtx = {
                      ssrc: sendEncodingParameters[0].ssrc + 1
                    };
                  }
                }
                if (transceiver.wantReceive) {
                  transceiver.rtpReceiver = new window.RTCRtpReceiver(
                    transceiver.dtlsTransport,
                    kind
                  );
                }
                transceiver.localCapabilities = localCapabilities;
                transceiver.sendEncodingParameters = sendEncodingParameters;
              });
              if (pc._config.bundlePolicy !== "max-compat") {
                sdp +=
                  "a=group:BUNDLE " +
                  pc.transceivers
                    .map(function(t) {
                      return t.mid;
                    })
                    .join(" ") +
                  "\r\n";
              }
              sdp += "a=ice-options:trickle\r\n";
              pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                sdp += writeMediaSection(
                  transceiver,
                  transceiver.localCapabilities,
                  "offer",
                  transceiver.stream,
                  pc._dtlsRole
                );
                sdp += "a=rtcp-rsize\r\n";
                if (
                  transceiver.iceGatherer &&
                  pc.iceGatheringState !== "new" &&
                  (sdpMLineIndex === 0 || !pc.usingBundle)
                ) {
                  transceiver.iceGatherer
                    .getLocalCandidates()
                    .forEach(function(cand) {
                      cand.component = 1;
                      sdp += "a=" + SDPUtils.writeCandidate(cand) + "\r\n";
                    });
                  if (transceiver.iceGatherer.state === "completed") {
                    sdp += "a=end-of-candidates\r\n";
                  }
                }
              });
              var desc = new window.RTCSessionDescription({
                type: "offer",
                sdp: sdp
              });
              return Promise.resolve(desc);
            };
            RTCPeerConnection.prototype.createAnswer = function() {
              var pc = this;
              if (pc._isClosed) {
                return Promise.reject(
                  makeError(
                    "InvalidStateError",
                    "Can not call createAnswer after close"
                  )
                );
              }
              var sdp = SDPUtils.writeSessionBoilerplate(
                pc._sdpSessionId,
                pc._sdpSessionVersion++
              );
              if (pc.usingBundle) {
                sdp +=
                  "a=group:BUNDLE " +
                  pc.transceivers
                    .map(function(t) {
                      return t.mid;
                    })
                    .join(" ") +
                  "\r\n";
              }
              var mediaSectionsInOffer = SDPUtils.getMediaSections(
                pc.remoteDescription.sdp
              ).length;
              pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
                  return;
                }
                if (transceiver.isDatachannel) {
                  sdp +=
                    "m=application 0 DTLS/SCTP 5000\r\n" +
                    "c=IN IP4 0.0.0.0\r\n" +
                    "a=mid:" +
                    transceiver.mid +
                    "\r\n";
                  return;
                }
                if (transceiver.stream) {
                  var localTrack;
                  if (transceiver.kind === "audio") {
                    localTrack = transceiver.stream.getAudioTracks()[0];
                  } else if (transceiver.kind === "video") {
                    localTrack = transceiver.stream.getVideoTracks()[0];
                  }
                  if (localTrack) {
                    if (
                      edgeVersion >= 15019 &&
                      transceiver.kind === "video" &&
                      !transceiver.sendEncodingParameters[0].rtx
                    ) {
                      transceiver.sendEncodingParameters[0].rtx = {
                        ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                      };
                    }
                  }
                }
                var commonCapabilities = getCommonCapabilities(
                  transceiver.localCapabilities,
                  transceiver.remoteCapabilities
                );
                var hasRtx = commonCapabilities.codecs.filter(function(c) {
                  return c.name.toLowerCase() === "rtx";
                }).length;
                if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
                  delete transceiver.sendEncodingParameters[0].rtx;
                }
                sdp += writeMediaSection(
                  transceiver,
                  commonCapabilities,
                  "answer",
                  transceiver.stream,
                  pc._dtlsRole
                );
                if (
                  transceiver.rtcpParameters &&
                  transceiver.rtcpParameters.reducedSize
                ) {
                  sdp += "a=rtcp-rsize\r\n";
                }
              });
              var desc = new window.RTCSessionDescription({
                type: "answer",
                sdp: sdp
              });
              return Promise.resolve(desc);
            };
            RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
              var pc = this;
              var sections;
              if (
                candidate &&
                !(candidate.sdpMLineIndex !== undefined || candidate.sdpMid)
              ) {
                return Promise.reject(
                  new TypeError("sdpMLineIndex or sdpMid required")
                );
              }
              return new Promise(function(resolve, reject) {
                if (!pc.remoteDescription) {
                  return reject(
                    makeError(
                      "InvalidStateError",
                      "Can not add ICE candidate without a remote description"
                    )
                  );
                } else if (!candidate || candidate.candidate === "") {
                  for (var j = 0; j < pc.transceivers.length; j++) {
                    if (pc.transceivers[j].isDatachannel) {
                      continue;
                    }
                    pc.transceivers[j].iceTransport.addRemoteCandidate({});
                    sections = SDPUtils.getMediaSections(
                      pc.remoteDescription.sdp
                    );
                    sections[j] += "a=end-of-candidates\r\n";
                    pc.remoteDescription.sdp =
                      SDPUtils.getDescription(pc.remoteDescription.sdp) +
                      sections.join("");
                    if (pc.usingBundle) {
                      break;
                    }
                  }
                } else {
                  var sdpMLineIndex = candidate.sdpMLineIndex;
                  if (candidate.sdpMid) {
                    for (var i = 0; i < pc.transceivers.length; i++) {
                      if (pc.transceivers[i].mid === candidate.sdpMid) {
                        sdpMLineIndex = i;
                        break;
                      }
                    }
                  }
                  var transceiver = pc.transceivers[sdpMLineIndex];
                  if (transceiver) {
                    if (transceiver.isDatachannel) {
                      return resolve();
                    }
                    var cand =
                      Object.keys(candidate.candidate).length > 0
                        ? SDPUtils.parseCandidate(candidate.candidate)
                        : {};
                    if (
                      cand.protocol === "tcp" &&
                      (cand.port === 0 || cand.port === 9)
                    ) {
                      return resolve();
                    }
                    if (cand.component && cand.component !== 1) {
                      return resolve();
                    }
                    if (
                      sdpMLineIndex === 0 ||
                      (sdpMLineIndex > 0 &&
                        transceiver.iceTransport !==
                          pc.transceivers[0].iceTransport)
                    ) {
                      if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                        return reject(
                          makeError(
                            "OperationError",
                            "Can not add ICE candidate"
                          )
                        );
                      }
                    }
                    var candidateString = candidate.candidate.trim();
                    if (candidateString.indexOf("a=") === 0) {
                      candidateString = candidateString.substr(2);
                    }
                    sections = SDPUtils.getMediaSections(
                      pc.remoteDescription.sdp
                    );
                    sections[sdpMLineIndex] +=
                      "a=" +
                      (cand.type ? candidateString : "end-of-candidates") +
                      "\r\n";
                    pc.remoteDescription.sdp = sections.join("");
                  } else {
                    return reject(
                      makeError("OperationError", "Can not add ICE candidate")
                    );
                  }
                }
                resolve();
              });
            };
            RTCPeerConnection.prototype.getStats = function() {
              var promises = [];
              this.transceivers.forEach(function(transceiver) {
                [
                  "rtpSender",
                  "rtpReceiver",
                  "iceGatherer",
                  "iceTransport",
                  "dtlsTransport"
                ].forEach(function(method) {
                  if (transceiver[method]) {
                    promises.push(transceiver[method].getStats());
                  }
                });
              });
              var fixStatsType = function(stat) {
                return (
                  {
                    inboundrtp: "inbound-rtp",
                    outboundrtp: "outbound-rtp",
                    candidatepair: "candidate-pair",
                    localcandidate: "local-candidate",
                    remotecandidate: "remote-candidate"
                  }[stat.type] || stat.type
                );
              };
              return new Promise(function(resolve) {
                var results = new Map();
                Promise.all(promises).then(function(res) {
                  res.forEach(function(result) {
                    Object.keys(result).forEach(function(id) {
                      result[id].type = fixStatsType(result[id]);
                      results.set(id, result[id]);
                    });
                  });
                  resolve(results);
                });
              });
            };
            var methods = ["createOffer", "createAnswer"];
            methods.forEach(function(method) {
              var nativeMethod = RTCPeerConnection.prototype[method];
              RTCPeerConnection.prototype[method] = function() {
                var args = arguments;
                if (
                  typeof args[0] === "function" ||
                  typeof args[1] === "function"
                ) {
                  return nativeMethod.apply(this, [arguments[2]]).then(
                    function(description) {
                      if (typeof args[0] === "function") {
                        args[0].apply(null, [description]);
                      }
                    },
                    function(error) {
                      if (typeof args[1] === "function") {
                        args[1].apply(null, [error]);
                      }
                    }
                  );
                }
                return nativeMethod.apply(this, arguments);
              };
            });
            methods = [
              "setLocalDescription",
              "setRemoteDescription",
              "addIceCandidate"
            ];
            methods.forEach(function(method) {
              var nativeMethod = RTCPeerConnection.prototype[method];
              RTCPeerConnection.prototype[method] = function() {
                var args = arguments;
                if (
                  typeof args[1] === "function" ||
                  typeof args[2] === "function"
                ) {
                  return nativeMethod.apply(this, arguments).then(
                    function() {
                      if (typeof args[1] === "function") {
                        args[1].apply(null);
                      }
                    },
                    function(error) {
                      if (typeof args[2] === "function") {
                        args[2].apply(null, [error]);
                      }
                    }
                  );
                }
                return nativeMethod.apply(this, arguments);
              };
            });
            ["getStats"].forEach(function(method) {
              var nativeMethod = RTCPeerConnection.prototype[method];
              RTCPeerConnection.prototype[method] = function() {
                var args = arguments;
                if (typeof args[1] === "function") {
                  return nativeMethod.apply(this, arguments).then(function() {
                    if (typeof args[1] === "function") {
                      args[1].apply(null);
                    }
                  });
                }
                return nativeMethod.apply(this, arguments);
              };
            });
            return RTCPeerConnection;
          };
        },
        { sdp: 50 }
      ],
      50: [
        function(require, module, exports) {
          "use strict";
          var SDPUtils = {};
          SDPUtils.generateIdentifier = function() {
            return Math.random()
              .toString(36)
              .substr(2, 10);
          };
          SDPUtils.localCName = SDPUtils.generateIdentifier();
          SDPUtils.splitLines = function(blob) {
            return blob
              .trim()
              .split("\n")
              .map(function(line) {
                return line.trim();
              });
          };
          SDPUtils.splitSections = function(blob) {
            var parts = blob.split("\nm=");
            return parts.map(function(part, index) {
              return (index > 0 ? "m=" + part : part).trim() + "\r\n";
            });
          };
          SDPUtils.getDescription = function(blob) {
            var sections = SDPUtils.splitSections(blob);
            return sections && sections[0];
          };
          SDPUtils.getMediaSections = function(blob) {
            var sections = SDPUtils.splitSections(blob);
            sections.shift();
            return sections;
          };
          SDPUtils.matchPrefix = function(blob, prefix) {
            return SDPUtils.splitLines(blob).filter(function(line) {
              return line.indexOf(prefix) === 0;
            });
          };
          SDPUtils.parseCandidate = function(line) {
            var parts;
            if (line.indexOf("a=candidate:") === 0) {
              parts = line.substring(12).split(" ");
            } else {
              parts = line.substring(10).split(" ");
            }
            var candidate = {
              foundation: parts[0],
              component: parseInt(parts[1], 10),
              protocol: parts[2].toLowerCase(),
              priority: parseInt(parts[3], 10),
              ip: parts[4],
              address: parts[4],
              port: parseInt(parts[5], 10),
              type: parts[7]
            };
            for (var i = 8; i < parts.length; i += 2) {
              switch (parts[i]) {
                case "raddr":
                  candidate.relatedAddress = parts[i + 1];
                  break;
                case "rport":
                  candidate.relatedPort = parseInt(parts[i + 1], 10);
                  break;
                case "tcptype":
                  candidate.tcpType = parts[i + 1];
                  break;
                case "ufrag":
                  candidate.ufrag = parts[i + 1];
                  candidate.usernameFragment = parts[i + 1];
                  break;
                default:
                  candidate[parts[i]] = parts[i + 1];
                  break;
              }
            }
            return candidate;
          };
          SDPUtils.writeCandidate = function(candidate) {
            var sdp = [];
            sdp.push(candidate.foundation);
            sdp.push(candidate.component);
            sdp.push(candidate.protocol.toUpperCase());
            sdp.push(candidate.priority);
            sdp.push(candidate.address || candidate.ip);
            sdp.push(candidate.port);
            var type = candidate.type;
            sdp.push("typ");
            sdp.push(type);
            if (
              type !== "host" &&
              candidate.relatedAddress &&
              candidate.relatedPort
            ) {
              sdp.push("raddr");
              sdp.push(candidate.relatedAddress);
              sdp.push("rport");
              sdp.push(candidate.relatedPort);
            }
            if (
              candidate.tcpType &&
              candidate.protocol.toLowerCase() === "tcp"
            ) {
              sdp.push("tcptype");
              sdp.push(candidate.tcpType);
            }
            if (candidate.usernameFragment || candidate.ufrag) {
              sdp.push("ufrag");
              sdp.push(candidate.usernameFragment || candidate.ufrag);
            }
            return "candidate:" + sdp.join(" ");
          };
          SDPUtils.parseIceOptions = function(line) {
            return line.substr(14).split(" ");
          };
          SDPUtils.parseRtpMap = function(line) {
            var parts = line.substr(9).split(" ");
            var parsed = { payloadType: parseInt(parts.shift(), 10) };
            parts = parts[0].split("/");
            parsed.name = parts[0];
            parsed.clockRate = parseInt(parts[1], 10);
            parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
            parsed.numChannels = parsed.channels;
            return parsed;
          };
          SDPUtils.writeRtpMap = function(codec) {
            var pt = codec.payloadType;
            if (codec.preferredPayloadType !== undefined) {
              pt = codec.preferredPayloadType;
            }
            var channels = codec.channels || codec.numChannels || 1;
            return (
              "a=rtpmap:" +
              pt +
              " " +
              codec.name +
              "/" +
              codec.clockRate +
              (channels !== 1 ? "/" + channels : "") +
              "\r\n"
            );
          };
          SDPUtils.parseExtmap = function(line) {
            var parts = line.substr(9).split(" ");
            return {
              id: parseInt(parts[0], 10),
              direction:
                parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
              uri: parts[1]
            };
          };
          SDPUtils.writeExtmap = function(headerExtension) {
            return (
              "a=extmap:" +
              (headerExtension.id || headerExtension.preferredId) +
              (headerExtension.direction &&
              headerExtension.direction !== "sendrecv"
                ? "/" + headerExtension.direction
                : "") +
              " " +
              headerExtension.uri +
              "\r\n"
            );
          };
          SDPUtils.parseFmtp = function(line) {
            var parsed = {};
            var kv;
            var parts = line.substr(line.indexOf(" ") + 1).split(";");
            for (var j = 0; j < parts.length; j++) {
              kv = parts[j].trim().split("=");
              parsed[kv[0].trim()] = kv[1];
            }
            return parsed;
          };
          SDPUtils.writeFmtp = function(codec) {
            var line = "";
            var pt = codec.payloadType;
            if (codec.preferredPayloadType !== undefined) {
              pt = codec.preferredPayloadType;
            }
            if (codec.parameters && Object.keys(codec.parameters).length) {
              var params = [];
              Object.keys(codec.parameters).forEach(function(param) {
                if (codec.parameters[param]) {
                  params.push(param + "=" + codec.parameters[param]);
                } else {
                  params.push(param);
                }
              });
              line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
            }
            return line;
          };
          SDPUtils.parseRtcpFb = function(line) {
            var parts = line.substr(line.indexOf(" ") + 1).split(" ");
            return { type: parts.shift(), parameter: parts.join(" ") };
          };
          SDPUtils.writeRtcpFb = function(codec) {
            var lines = "";
            var pt = codec.payloadType;
            if (codec.preferredPayloadType !== undefined) {
              pt = codec.preferredPayloadType;
            }
            if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
              codec.rtcpFeedback.forEach(function(fb) {
                lines +=
                  "a=rtcp-fb:" +
                  pt +
                  " " +
                  fb.type +
                  (fb.parameter && fb.parameter.length
                    ? " " + fb.parameter
                    : "") +
                  "\r\n";
              });
            }
            return lines;
          };
          SDPUtils.parseSsrcMedia = function(line) {
            var sp = line.indexOf(" ");
            var parts = { ssrc: parseInt(line.substr(7, sp - 7), 10) };
            var colon = line.indexOf(":", sp);
            if (colon > -1) {
              parts.attribute = line.substr(sp + 1, colon - sp - 1);
              parts.value = line.substr(colon + 1);
            } else {
              parts.attribute = line.substr(sp + 1);
            }
            return parts;
          };
          SDPUtils.parseSsrcGroup = function(line) {
            var parts = line.substr(13).split(" ");
            return {
              semantics: parts.shift(),
              ssrcs: parts.map(function(ssrc) {
                return parseInt(ssrc, 10);
              })
            };
          };
          SDPUtils.getMid = function(mediaSection) {
            var mid = SDPUtils.matchPrefix(mediaSection, "a=mid:")[0];
            if (mid) {
              return mid.substr(6);
            }
          };
          SDPUtils.parseFingerprint = function(line) {
            var parts = line.substr(14).split(" ");
            return { algorithm: parts[0].toLowerCase(), value: parts[1] };
          };
          SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
            var lines = SDPUtils.matchPrefix(
              mediaSection + sessionpart,
              "a=fingerprint:"
            );
            return {
              role: "auto",
              fingerprints: lines.map(SDPUtils.parseFingerprint)
            };
          };
          SDPUtils.writeDtlsParameters = function(params, setupType) {
            var sdp = "a=setup:" + setupType + "\r\n";
            params.fingerprints.forEach(function(fp) {
              sdp += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
            });
            return sdp;
          };
          SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
            var lines = SDPUtils.splitLines(mediaSection);
            lines = lines.concat(SDPUtils.splitLines(sessionpart));
            var iceParameters = {
              usernameFragment: lines
                .filter(function(line) {
                  return line.indexOf("a=ice-ufrag:") === 0;
                })[0]
                .substr(12),
              password: lines
                .filter(function(line) {
                  return line.indexOf("a=ice-pwd:") === 0;
                })[0]
                .substr(10)
            };
            return iceParameters;
          };
          SDPUtils.writeIceParameters = function(params) {
            return (
              "a=ice-ufrag:" +
              params.usernameFragment +
              "\r\n" +
              "a=ice-pwd:" +
              params.password +
              "\r\n"
            );
          };
          SDPUtils.parseRtpParameters = function(mediaSection) {
            var description = {
              codecs: [],
              headerExtensions: [],
              fecMechanisms: [],
              rtcp: []
            };
            var lines = SDPUtils.splitLines(mediaSection);
            var mline = lines[0].split(" ");
            for (var i = 3; i < mline.length; i++) {
              var pt = mline[i];
              var rtpmapline = SDPUtils.matchPrefix(
                mediaSection,
                "a=rtpmap:" + pt + " "
              )[0];
              if (rtpmapline) {
                var codec = SDPUtils.parseRtpMap(rtpmapline);
                var fmtps = SDPUtils.matchPrefix(
                  mediaSection,
                  "a=fmtp:" + pt + " "
                );
                codec.parameters = fmtps.length
                  ? SDPUtils.parseFmtp(fmtps[0])
                  : {};
                codec.rtcpFeedback = SDPUtils.matchPrefix(
                  mediaSection,
                  "a=rtcp-fb:" + pt + " "
                ).map(SDPUtils.parseRtcpFb);
                description.codecs.push(codec);
                switch (codec.name.toUpperCase()) {
                  case "RED":
                  case "ULPFEC":
                    description.fecMechanisms.push(codec.name.toUpperCase());
                    break;
                  default:
                    break;
                }
              }
            }
            SDPUtils.matchPrefix(mediaSection, "a=extmap:").forEach(function(
              line
            ) {
              description.headerExtensions.push(SDPUtils.parseExtmap(line));
            });
            return description;
          };
          SDPUtils.writeRtpDescription = function(kind, caps) {
            var sdp = "";
            sdp += "m=" + kind + " ";
            sdp += caps.codecs.length > 0 ? "9" : "0";
            sdp += " UDP/TLS/RTP/SAVPF ";
            sdp +=
              caps.codecs
                .map(function(codec) {
                  if (codec.preferredPayloadType !== undefined) {
                    return codec.preferredPayloadType;
                  }
                  return codec.payloadType;
                })
                .join(" ") + "\r\n";
            sdp += "c=IN IP4 0.0.0.0\r\n";
            sdp += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
            caps.codecs.forEach(function(codec) {
              sdp += SDPUtils.writeRtpMap(codec);
              sdp += SDPUtils.writeFmtp(codec);
              sdp += SDPUtils.writeRtcpFb(codec);
            });
            var maxptime = 0;
            caps.codecs.forEach(function(codec) {
              if (codec.maxptime > maxptime) {
                maxptime = codec.maxptime;
              }
            });
            if (maxptime > 0) {
              sdp += "a=maxptime:" + maxptime + "\r\n";
            }
            sdp += "a=rtcp-mux\r\n";
            if (caps.headerExtensions) {
              caps.headerExtensions.forEach(function(extension) {
                sdp += SDPUtils.writeExtmap(extension);
              });
            }
            return sdp;
          };
          SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
            var encodingParameters = [];
            var description = SDPUtils.parseRtpParameters(mediaSection);
            var hasRed = description.fecMechanisms.indexOf("RED") !== -1;
            var hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
            var ssrcs = SDPUtils.matchPrefix(mediaSection, "a=ssrc:")
              .map(function(line) {
                return SDPUtils.parseSsrcMedia(line);
              })
              .filter(function(parts) {
                return parts.attribute === "cname";
              });
            var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
            var secondarySsrc;
            var flows = SDPUtils.matchPrefix(
              mediaSection,
              "a=ssrc-group:FID"
            ).map(function(line) {
              var parts = line.substr(17).split(" ");
              return parts.map(function(part) {
                return parseInt(part, 10);
              });
            });
            if (
              flows.length > 0 &&
              flows[0].length > 1 &&
              flows[0][0] === primarySsrc
            ) {
              secondarySsrc = flows[0][1];
            }
            description.codecs.forEach(function(codec) {
              if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
                var encParam = {
                  ssrc: primarySsrc,
                  codecPayloadType: parseInt(codec.parameters.apt, 10)
                };
                if (primarySsrc && secondarySsrc) {
                  encParam.rtx = { ssrc: secondarySsrc };
                }
                encodingParameters.push(encParam);
                if (hasRed) {
                  encParam = JSON.parse(JSON.stringify(encParam));
                  encParam.fec = {
                    ssrc: primarySsrc,
                    mechanism: hasUlpfec ? "red+ulpfec" : "red"
                  };
                  encodingParameters.push(encParam);
                }
              }
            });
            if (encodingParameters.length === 0 && primarySsrc) {
              encodingParameters.push({ ssrc: primarySsrc });
            }
            var bandwidth = SDPUtils.matchPrefix(mediaSection, "b=");
            if (bandwidth.length) {
              if (bandwidth[0].indexOf("b=TIAS:") === 0) {
                bandwidth = parseInt(bandwidth[0].substr(7), 10);
              } else if (bandwidth[0].indexOf("b=AS:") === 0) {
                bandwidth =
                  parseInt(bandwidth[0].substr(5), 10) * 1e3 * 0.95 -
                  50 * 40 * 8;
              } else {
                bandwidth = undefined;
              }
              encodingParameters.forEach(function(params) {
                params.maxBitrate = bandwidth;
              });
            }
            return encodingParameters;
          };
          SDPUtils.parseRtcpParameters = function(mediaSection) {
            var rtcpParameters = {};
            var remoteSsrc = SDPUtils.matchPrefix(mediaSection, "a=ssrc:")
              .map(function(line) {
                return SDPUtils.parseSsrcMedia(line);
              })
              .filter(function(obj) {
                return obj.attribute === "cname";
              })[0];
            if (remoteSsrc) {
              rtcpParameters.cname = remoteSsrc.value;
              rtcpParameters.ssrc = remoteSsrc.ssrc;
            }
            var rsize = SDPUtils.matchPrefix(mediaSection, "a=rtcp-rsize");
            rtcpParameters.reducedSize = rsize.length > 0;
            rtcpParameters.compound = rsize.length === 0;
            var mux = SDPUtils.matchPrefix(mediaSection, "a=rtcp-mux");
            rtcpParameters.mux = mux.length > 0;
            return rtcpParameters;
          };
          SDPUtils.parseMsid = function(mediaSection) {
            var parts;
            var spec = SDPUtils.matchPrefix(mediaSection, "a=msid:");
            if (spec.length === 1) {
              parts = spec[0].substr(7).split(" ");
              return { stream: parts[0], track: parts[1] };
            }
            var planB = SDPUtils.matchPrefix(mediaSection, "a=ssrc:")
              .map(function(line) {
                return SDPUtils.parseSsrcMedia(line);
              })
              .filter(function(msidParts) {
                return msidParts.attribute === "msid";
              });
            if (planB.length > 0) {
              parts = planB[0].value.split(" ");
              return { stream: parts[0], track: parts[1] };
            }
          };
          SDPUtils.parseSctpDescription = function(mediaSection) {
            var mline = SDPUtils.parseMLine(mediaSection);
            var maxSizeLine = SDPUtils.matchPrefix(
              mediaSection,
              "a=max-message-size:"
            );
            var maxMessageSize;
            if (maxSizeLine.length > 0) {
              maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
            }
            if (isNaN(maxMessageSize)) {
              maxMessageSize = 65536;
            }
            var sctpPort = SDPUtils.matchPrefix(mediaSection, "a=sctp-port:");
            if (sctpPort.length > 0) {
              return {
                port: parseInt(sctpPort[0].substr(12), 10),
                protocol: mline.fmt,
                maxMessageSize: maxMessageSize
              };
            }
            var sctpMapLines = SDPUtils.matchPrefix(mediaSection, "a=sctpmap:");
            if (sctpMapLines.length > 0) {
              var parts = SDPUtils.matchPrefix(mediaSection, "a=sctpmap:")[0]
                .substr(10)
                .split(" ");
              return {
                port: parseInt(parts[0], 10),
                protocol: parts[1],
                maxMessageSize: maxMessageSize
              };
            }
          };
          SDPUtils.writeSctpDescription = function(media, sctp) {
            var output = [];
            if (media.protocol !== "DTLS/SCTP") {
              output = [
                "m=" +
                  media.kind +
                  " 9 " +
                  media.protocol +
                  " " +
                  sctp.protocol +
                  "\r\n",
                "c=IN IP4 0.0.0.0\r\n",
                "a=sctp-port:" + sctp.port + "\r\n"
              ];
            } else {
              output = [
                "m=" +
                  media.kind +
                  " 9 " +
                  media.protocol +
                  " " +
                  sctp.port +
                  "\r\n",
                "c=IN IP4 0.0.0.0\r\n",
                "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
              ];
            }
            if (sctp.maxMessageSize !== undefined) {
              output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
            }
            return output.join("");
          };
          SDPUtils.generateSessionId = function() {
            return Math.random()
              .toString()
              .substr(2, 21);
          };
          SDPUtils.writeSessionBoilerplate = function(
            sessId,
            sessVer,
            sessUser
          ) {
            var sessionId;
            var version = sessVer !== undefined ? sessVer : 2;
            if (sessId) {
              sessionId = sessId;
            } else {
              sessionId = SDPUtils.generateSessionId();
            }
            var user = sessUser || "thisisadapterortc";
            return (
              "v=0\r\n" +
              "o=" +
              user +
              " " +
              sessionId +
              " " +
              version +
              " IN IP4 127.0.0.1\r\n" +
              "s=-\r\n" +
              "t=0 0\r\n"
            );
          };
          SDPUtils.writeMediaSection = function(
            transceiver,
            caps,
            type,
            stream
          ) {
            var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
            sdp += SDPUtils.writeIceParameters(
              transceiver.iceGatherer.getLocalParameters()
            );
            sdp += SDPUtils.writeDtlsParameters(
              transceiver.dtlsTransport.getLocalParameters(),
              type === "offer" ? "actpass" : "active"
            );
            sdp += "a=mid:" + transceiver.mid + "\r\n";
            if (transceiver.direction) {
              sdp += "a=" + transceiver.direction + "\r\n";
            } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
              sdp += "a=sendrecv\r\n";
            } else if (transceiver.rtpSender) {
              sdp += "a=sendonly\r\n";
            } else if (transceiver.rtpReceiver) {
              sdp += "a=recvonly\r\n";
            } else {
              sdp += "a=inactive\r\n";
            }
            if (transceiver.rtpSender) {
              var msid =
                "msid:" +
                stream.id +
                " " +
                transceiver.rtpSender.track.id +
                "\r\n";
              sdp += "a=" + msid;
              sdp +=
                "a=ssrc:" +
                transceiver.sendEncodingParameters[0].ssrc +
                " " +
                msid;
              if (transceiver.sendEncodingParameters[0].rtx) {
                sdp +=
                  "a=ssrc:" +
                  transceiver.sendEncodingParameters[0].rtx.ssrc +
                  " " +
                  msid;
                sdp +=
                  "a=ssrc-group:FID " +
                  transceiver.sendEncodingParameters[0].ssrc +
                  " " +
                  transceiver.sendEncodingParameters[0].rtx.ssrc +
                  "\r\n";
              }
            }
            sdp +=
              "a=ssrc:" +
              transceiver.sendEncodingParameters[0].ssrc +
              " cname:" +
              SDPUtils.localCName +
              "\r\n";
            if (
              transceiver.rtpSender &&
              transceiver.sendEncodingParameters[0].rtx
            ) {
              sdp +=
                "a=ssrc:" +
                transceiver.sendEncodingParameters[0].rtx.ssrc +
                " cname:" +
                SDPUtils.localCName +
                "\r\n";
            }
            return sdp;
          };
          SDPUtils.getDirection = function(mediaSection, sessionpart) {
            var lines = SDPUtils.splitLines(mediaSection);
            for (var i = 0; i < lines.length; i++) {
              switch (lines[i]) {
                case "a=sendrecv":
                case "a=sendonly":
                case "a=recvonly":
                case "a=inactive":
                  return lines[i].substr(2);
                default:
              }
            }
            if (sessionpart) {
              return SDPUtils.getDirection(sessionpart);
            }
            return "sendrecv";
          };
          SDPUtils.getKind = function(mediaSection) {
            var lines = SDPUtils.splitLines(mediaSection);
            var mline = lines[0].split(" ");
            return mline[0].substr(2);
          };
          SDPUtils.isRejected = function(mediaSection) {
            return mediaSection.split(" ", 2)[1] === "0";
          };
          SDPUtils.parseMLine = function(mediaSection) {
            var lines = SDPUtils.splitLines(mediaSection);
            var parts = lines[0].substr(2).split(" ");
            return {
              kind: parts[0],
              port: parseInt(parts[1], 10),
              protocol: parts[2],
              fmt: parts.slice(3).join(" ")
            };
          };
          SDPUtils.parseOLine = function(mediaSection) {
            var line = SDPUtils.matchPrefix(mediaSection, "o=")[0];
            var parts = line.substr(2).split(" ");
            return {
              username: parts[0],
              sessionId: parts[1],
              sessionVersion: parseInt(parts[2], 10),
              netType: parts[3],
              addressType: parts[4],
              address: parts[5]
            };
          };
          SDPUtils.isValidSDP = function(blob) {
            if (typeof blob !== "string" || blob.length === 0) {
              return false;
            }
            var lines = SDPUtils.splitLines(blob);
            for (var i = 0; i < lines.length; i++) {
              if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
                return false;
              }
            }
            return true;
          };
          if (typeof module === "object") {
            module.exports = SDPUtils;
          }
        },
        {}
      ],
      51: [
        function(require, module, exports) {
          if (typeof Object.create === "function") {
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              });
            };
          } else {
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              var TempCtor = function() {};
              TempCtor.prototype = superCtor.prototype;
              ctor.prototype = new TempCtor();
              ctor.prototype.constructor = ctor;
            };
          }
        },
        {}
      ],
      52: [
        function(require, module, exports) {
          module.exports = function isBuffer(arg) {
            return (
              arg &&
              typeof arg === "object" &&
              typeof arg.copy === "function" &&
              typeof arg.fill === "function" &&
              typeof arg.readUInt8 === "function"
            );
          };
        },
        {}
      ],
      53: [
        function(require, module, exports) {
          (function(process, global) {
            var formatRegExp = /%[sdj%]/g;
            exports.format = function(f) {
              if (!isString(f)) {
                var objects = [];
                for (var i = 0; i < arguments.length; i++) {
                  objects.push(inspect(arguments[i]));
                }
                return objects.join(" ");
              }
              var i = 1;
              var args = arguments;
              var len = args.length;
              var str = String(f).replace(formatRegExp, function(x) {
                if (x === "%%") return "%";
                if (i >= len) return x;
                switch (x) {
                  case "%s":
                    return String(args[i++]);
                  case "%d":
                    return Number(args[i++]);
                  case "%j":
                    try {
                      return JSON.stringify(args[i++]);
                    } catch (_) {
                      return "[Circular]";
                    }
                  default:
                    return x;
                }
              });
              for (var x = args[i]; i < len; x = args[++i]) {
                if (isNull(x) || !isObject(x)) {
                  str += " " + x;
                } else {
                  str += " " + inspect(x);
                }
              }
              return str;
            };
            exports.deprecate = function(fn, msg) {
              if (isUndefined(global.process)) {
                return function() {
                  return exports.deprecate(fn, msg).apply(this, arguments);
                };
              }
              if (process.noDeprecation === true) {
                return fn;
              }
              var warned = false;
              function deprecated() {
                if (!warned) {
                  if (process.throwDeprecation) {
                    throw new Error(msg);
                  } else if (process.traceDeprecation) {
                    console.trace(msg);
                  } else {
                    console.error(msg);
                  }
                  warned = true;
                }
                return fn.apply(this, arguments);
              }
              return deprecated;
            };
            var debugs = {};
            var debugEnviron;
            exports.debuglog = function(set) {
              if (isUndefined(debugEnviron))
                debugEnviron = process.env.NODE_DEBUG || "";
              set = set.toUpperCase();
              if (!debugs[set]) {
                if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
                  var pid = process.pid;
                  debugs[set] = function() {
                    var msg = exports.format.apply(exports, arguments);
                    console.error("%s %d: %s", set, pid, msg);
                  };
                } else {
                  debugs[set] = function() {};
                }
              }
              return debugs[set];
            };
            function inspect(obj, opts) {
              var ctx = { seen: [], stylize: stylizeNoColor };
              if (arguments.length >= 3) ctx.depth = arguments[2];
              if (arguments.length >= 4) ctx.colors = arguments[3];
              if (isBoolean(opts)) {
                ctx.showHidden = opts;
              } else if (opts) {
                exports._extend(ctx, opts);
              }
              if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
              if (isUndefined(ctx.depth)) ctx.depth = 2;
              if (isUndefined(ctx.colors)) ctx.colors = false;
              if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
              if (ctx.colors) ctx.stylize = stylizeWithColor;
              return formatValue(ctx, obj, ctx.depth);
            }
            exports.inspect = inspect;
            inspect.colors = {
              bold: [1, 22],
              italic: [3, 23],
              underline: [4, 24],
              inverse: [7, 27],
              white: [37, 39],
              grey: [90, 39],
              black: [30, 39],
              blue: [34, 39],
              cyan: [36, 39],
              green: [32, 39],
              magenta: [35, 39],
              red: [31, 39],
              yellow: [33, 39]
            };
            inspect.styles = {
              special: "cyan",
              number: "yellow",
              boolean: "yellow",
              undefined: "grey",
              null: "bold",
              string: "green",
              date: "magenta",
              regexp: "red"
            };
            function stylizeWithColor(str, styleType) {
              var style = inspect.styles[styleType];
              if (style) {
                return (
                  "\x1b[" +
                  inspect.colors[style][0] +
                  "m" +
                  str +
                  "\x1b[" +
                  inspect.colors[style][1] +
                  "m"
                );
              } else {
                return str;
              }
            }
            function stylizeNoColor(str, styleType) {
              return str;
            }
            function arrayToHash(array) {
              var hash = {};
              array.forEach(function(val, idx) {
                hash[val] = true;
              });
              return hash;
            }
            function formatValue(ctx, value, recurseTimes) {
              if (
                ctx.customInspect &&
                value &&
                isFunction(value.inspect) &&
                value.inspect !== exports.inspect &&
                !(value.constructor && value.constructor.prototype === value)
              ) {
                var ret = value.inspect(recurseTimes, ctx);
                if (!isString(ret)) {
                  ret = formatValue(ctx, ret, recurseTimes);
                }
                return ret;
              }
              var primitive = formatPrimitive(ctx, value);
              if (primitive) {
                return primitive;
              }
              var keys = Object.keys(value);
              var visibleKeys = arrayToHash(keys);
              if (ctx.showHidden) {
                keys = Object.getOwnPropertyNames(value);
              }
              if (
                isError(value) &&
                (keys.indexOf("message") >= 0 ||
                  keys.indexOf("description") >= 0)
              ) {
                return formatError(value);
              }
              if (keys.length === 0) {
                if (isFunction(value)) {
                  var name = value.name ? ": " + value.name : "";
                  return ctx.stylize("[Function" + name + "]", "special");
                }
                if (isRegExp(value)) {
                  return ctx.stylize(
                    RegExp.prototype.toString.call(value),
                    "regexp"
                  );
                }
                if (isDate(value)) {
                  return ctx.stylize(
                    Date.prototype.toString.call(value),
                    "date"
                  );
                }
                if (isError(value)) {
                  return formatError(value);
                }
              }
              var base = "",
                array = false,
                braces = ["{", "}"];
              if (isArray(value)) {
                array = true;
                braces = ["[", "]"];
              }
              if (isFunction(value)) {
                var n = value.name ? ": " + value.name : "";
                base = " [Function" + n + "]";
              }
              if (isRegExp(value)) {
                base = " " + RegExp.prototype.toString.call(value);
              }
              if (isDate(value)) {
                base = " " + Date.prototype.toUTCString.call(value);
              }
              if (isError(value)) {
                base = " " + formatError(value);
              }
              if (keys.length === 0 && (!array || value.length == 0)) {
                return braces[0] + base + braces[1];
              }
              if (recurseTimes < 0) {
                if (isRegExp(value)) {
                  return ctx.stylize(
                    RegExp.prototype.toString.call(value),
                    "regexp"
                  );
                } else {
                  return ctx.stylize("[Object]", "special");
                }
              }
              ctx.seen.push(value);
              var output;
              if (array) {
                output = formatArray(
                  ctx,
                  value,
                  recurseTimes,
                  visibleKeys,
                  keys
                );
              } else {
                output = keys.map(function(key) {
                  return formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    key,
                    array
                  );
                });
              }
              ctx.seen.pop();
              return reduceToSingleString(output, base, braces);
            }
            function formatPrimitive(ctx, value) {
              if (isUndefined(value))
                return ctx.stylize("undefined", "undefined");
              if (isString(value)) {
                var simple =
                  "'" +
                  JSON.stringify(value)
                    .replace(/^"|"$/g, "")
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"') +
                  "'";
                return ctx.stylize(simple, "string");
              }
              if (isNumber(value)) return ctx.stylize("" + value, "number");
              if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
              if (isNull(value)) return ctx.stylize("null", "null");
            }
            function formatError(value) {
              return "[" + Error.prototype.toString.call(value) + "]";
            }
            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
              var output = [];
              for (var i = 0, l = value.length; i < l; ++i) {
                if (hasOwnProperty(value, String(i))) {
                  output.push(
                    formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      String(i),
                      true
                    )
                  );
                } else {
                  output.push("");
                }
              }
              keys.forEach(function(key) {
                if (!key.match(/^\d+$/)) {
                  output.push(
                    formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      key,
                      true
                    )
                  );
                }
              });
              return output;
            }
            function formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              array
            ) {
              var name, str, desc;
              desc = Object.getOwnPropertyDescriptor(value, key) || {
                value: value[key]
              };
              if (desc.get) {
                if (desc.set) {
                  str = ctx.stylize("[Getter/Setter]", "special");
                } else {
                  str = ctx.stylize("[Getter]", "special");
                }
              } else {
                if (desc.set) {
                  str = ctx.stylize("[Setter]", "special");
                }
              }
              if (!hasOwnProperty(visibleKeys, key)) {
                name = "[" + key + "]";
              }
              if (!str) {
                if (ctx.seen.indexOf(desc.value) < 0) {
                  if (isNull(recurseTimes)) {
                    str = formatValue(ctx, desc.value, null);
                  } else {
                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                  }
                  if (str.indexOf("\n") > -1) {
                    if (array) {
                      str = str
                        .split("\n")
                        .map(function(line) {
                          return "  " + line;
                        })
                        .join("\n")
                        .substr(2);
                    } else {
                      str =
                        "\n" +
                        str
                          .split("\n")
                          .map(function(line) {
                            return "   " + line;
                          })
                          .join("\n");
                    }
                  }
                } else {
                  str = ctx.stylize("[Circular]", "special");
                }
              }
              if (isUndefined(name)) {
                if (array && key.match(/^\d+$/)) {
                  return str;
                }
                name = JSON.stringify("" + key);
                if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                  name = name.substr(1, name.length - 2);
                  name = ctx.stylize(name, "name");
                } else {
                  name = name
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"')
                    .replace(/(^"|"$)/g, "'");
                  name = ctx.stylize(name, "string");
                }
              }
              return name + ": " + str;
            }
            function reduceToSingleString(output, base, braces) {
              var numLinesEst = 0;
              var length = output.reduce(function(prev, cur) {
                numLinesEst++;
                if (cur.indexOf("\n") >= 0) numLinesEst++;
                return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
              }, 0);
              if (length > 60) {
                return (
                  braces[0] +
                  (base === "" ? "" : base + "\n ") +
                  " " +
                  output.join(",\n  ") +
                  " " +
                  braces[1]
                );
              }
              return (
                braces[0] + base + " " + output.join(", ") + " " + braces[1]
              );
            }
            function isArray(ar) {
              return Array.isArray(ar);
            }
            exports.isArray = isArray;
            function isBoolean(arg) {
              return typeof arg === "boolean";
            }
            exports.isBoolean = isBoolean;
            function isNull(arg) {
              return arg === null;
            }
            exports.isNull = isNull;
            function isNullOrUndefined(arg) {
              return arg == null;
            }
            exports.isNullOrUndefined = isNullOrUndefined;
            function isNumber(arg) {
              return typeof arg === "number";
            }
            exports.isNumber = isNumber;
            function isString(arg) {
              return typeof arg === "string";
            }
            exports.isString = isString;
            function isSymbol(arg) {
              return typeof arg === "symbol";
            }
            exports.isSymbol = isSymbol;
            function isUndefined(arg) {
              return arg === void 0;
            }
            exports.isUndefined = isUndefined;
            function isRegExp(re) {
              return isObject(re) && objectToString(re) === "[object RegExp]";
            }
            exports.isRegExp = isRegExp;
            function isObject(arg) {
              return typeof arg === "object" && arg !== null;
            }
            exports.isObject = isObject;
            function isDate(d) {
              return isObject(d) && objectToString(d) === "[object Date]";
            }
            exports.isDate = isDate;
            function isError(e) {
              return (
                isObject(e) &&
                (objectToString(e) === "[object Error]" || e instanceof Error)
              );
            }
            exports.isError = isError;
            function isFunction(arg) {
              return typeof arg === "function";
            }
            exports.isFunction = isFunction;
            function isPrimitive(arg) {
              return (
                arg === null ||
                typeof arg === "boolean" ||
                typeof arg === "number" ||
                typeof arg === "string" ||
                typeof arg === "symbol" ||
                typeof arg === "undefined"
              );
            }
            exports.isPrimitive = isPrimitive;
            exports.isBuffer = require("./support/isBuffer");
            function objectToString(o) {
              return Object.prototype.toString.call(o);
            }
            function pad(n) {
              return n < 10 ? "0" + n.toString(10) : n.toString(10);
            }
            var months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ];
            function timestamp() {
              var d = new Date();
              var time = [
                pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds())
              ].join(":");
              return [d.getDate(), months[d.getMonth()], time].join(" ");
            }
            exports.log = function() {
              console.log(
                "%s - %s",
                timestamp(),
                exports.format.apply(exports, arguments)
              );
            };
            exports.inherits = require("inherits");
            exports._extend = function(origin, add) {
              if (!add || !isObject(add)) return origin;
              var keys = Object.keys(add);
              var i = keys.length;
              while (i--) {
                origin[keys[i]] = add[keys[i]];
              }
              return origin;
            };
            function hasOwnProperty(obj, prop) {
              return Object.prototype.hasOwnProperty.call(obj, prop);
            }
          }.call(
            this,
            require("_process"),
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        { "./support/isBuffer": 52, _process: 46, inherits: 51 }
      ]
    },
    {},
    [3]
  );
  var Voice = bundle(3);
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return Voice;
    });
  } else {
    var Twilio = (root.Twilio = root.Twilio || {});
    Twilio.Connection = Twilio.Connection || Voice.Connection;
    Twilio.Device = Twilio.Device || Voice.Device;
    Twilio.PStream = Twilio.PStream || Voice.PStream;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : this
);
