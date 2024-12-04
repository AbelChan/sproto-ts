
export const SPROTO_REQUEST: number = 0;
export const SPROTO_RESPONSE: number = 1;
export const SPROTO_TARRAY = 0x80;
export const CHUNK_SIZE = 1000;
export const SIZEOF_LENGTH = 4;
export const SIZEOF_HEADER = 2;
export const SIZEOF_FIELD = 2;

export const ENCODE_BUFFERSIZE = 2050;
export const ENCODE_MAXSIZE = 0x1000000;
export const ENCODE_DEEPLEVEL = 64;

// sproto_arg.type
export enum SprotoTagType {
    SPROTO_TINTEGER = 0,
    SPROTO_TBOOLEAN,
    SPROTO_TSTRING,
    SPROTO_TDOUBLE,
    SPROTO_TSTRUCT
}

export enum StringSubType {
    TSTRING_STRING = 0,
    TSTRING_BINARY = 1
}

export enum SprotoCBType {
    SPROTO_CB_ERROR = -1,
    SPROTO_CB_NULL = -2,
    SPROTO_CB_NOARRAY = -3
}
