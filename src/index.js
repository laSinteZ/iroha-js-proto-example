"use strict";
exports.__esModule = true;
var ed25519 = require('ed25519.js');
var queries_pb_1 = require("../proto/queries_pb");
var primitive_pb_1 = require("../proto/primitive_pb");
var endpoint_pb_service_1 = require("../proto/endpoint_pb_service");
var date = Date.now();
var accountRequest = new queries_pb_1.GetAccount();
accountRequest.setAccountId("admin@test");
console.log(accountRequest);
var meta = new queries_pb_1.QueryPayloadMeta();
meta.setCreatorAccountId("admin@test");
meta.setCreatedTime(date);
meta.setQueryCounter(1);
var payload = new queries_pb_1.Query.Payload();
payload.setGetAccount(accountRequest);
payload.setMeta(meta);
var query = new queries_pb_1.Query();
query.setPayload(payload);
var adminPriv = '0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33';
var adminPub = '889f6b881e331be21487db77dcf32c5f8d3d5e8066e78d2feac4239fe91d416f';
var sign = ed25519.sign(Buffer.from(payload.serializeBinary()), Buffer.from(adminPub, 'hex'), Buffer.from(adminPriv, 'hex'));
var s = new primitive_pb_1.Signature();
s.setPubkey(Uint8Array.from(Buffer.from(adminPub, 'hex')));
s.setSignature(Uint8Array.from(sign));
query.setSignature(s);
var queryClient = new endpoint_pb_service_1.QueryServiceClient('http://localhost:8080');
queryClient.find(query, function (err, response) {
    console.log(response);
});