/**
 * @file SprotoHost.ts
 */

class SprotoHost {
    proto: Sproto;
    package: any;
    session: { [key: string]: any };

    constructor(sp: Sproto, packagename: string) {
        this.proto = sp;
        this.package = sp.querytype(packagename);
        if (!this.package) {
            this.package = "package";
        }
        this.session = {};
    }

    attach(sp: Sproto) {
        this.proto = sp;
        return (name: string, args: any, session: string, clientSenderSession: any) => {
            let proto = this.proto.queryproto(name);
            if (!proto) {
                console.warn("not find proto", name);
                return "";
            }
            let header_tmp = { type: proto.tag, session: session };
            let headerbuffer = this.proto.encode(this.package, header_tmp);
            if (session) {
                this.session[session] = proto.response? proto.response : true;
                if (proto.response) {
                    clientSenderSession.set(session, args);
                }
            }
            if (args && proto.request) {
                let databuffer = this.proto.encode(proto.request, args);
                return this.proto.pack(this.proto.utils.arrayconcat(headerbuffer, databuffer));
            } else {
                return this.proto.pack(headerbuffer);
            }
        };
    }

    dispatch(buffer: number[]) {
        let bin = this.proto.unpack(buffer);
        let header_tmp = { type: null, session: null };
        header_tmp = this.proto.decode(this.package, bin);
        if (!header_tmp) {
            header_tmp = {};
            return header_tmp;
        }
        let used_sz = this.proto.objlen(this.package, bin);
        let leftbuffer = bin.slice(used_sz, bin.length);
        if (header_tmp.type) {
            let proto = this.proto.queryproto(header_tmp.type);
            if (!proto) {
                return {};
            }
            let result;
            if (proto.request) {
                result = this.proto.decode(proto.request, leftbuffer);
            }
            if (header_tmp.session) {
                return {
                    type: "REQUEST",
                    pname: proto.name,
                    result: result,
                    responseFunc: this.gen_response(proto.response, header_tmp.session),
                    session: header_tmp.session
                };
            } else {
                return {
                    type: "REQUEST",
                    pname: proto.name,
                    result: result
                };
            }
        } else {
            let session = header_tmp.session;
            let response = this.session[session];
            delete this.session[session];
            if (response === true) {
                return {
                    type: "RESPONSE",
                    session: session
                };
            } else {
                let result = this.proto.decode(response, leftbuffer);
                return {
                    type: "RESPONSE",
                    pname: response?.name.split('.')[0],
                    session: session,
                    result: result,
                    errmsg: header_tmp.errmsg
                };
            }
        }
    }

    gen_response(response: any, session: string) {
        return (args: any) => {
            let header_tmp = { type: null, session: session };
            let headerbuffer = this.proto.encode(this.package, header_tmp);
            if (response) {
                let databuffer = this.proto.encode(response, args);
                return this.proto.pack(this.proto.utils.arrayconcat(headerbuffer, databuffer));
            } else {
                return this.proto.pack(headerbuffer);
            }
        };
    }
}