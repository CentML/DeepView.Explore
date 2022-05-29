
PROTOC_GEN_TS_PATH="../../node_modules/.bin/protoc-gen-ts"

# Directory to write generated code to (.js and .d.ts files)

SRCS=innpv.proto

OUT_DIR=.

all:
	protoc \
		--js_out=import_style=commonjs,binary:${OUT_DIR} \
		${SRCS}

old:
	protoc \
		--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
		--js_out="import_style=commonjs,binary:${OUT_DIR}" \
		--ts_out="${OUT_DIR}" \
		${SRCS}

clean:
	rm *.js *.ts
