import { CPP14Visitor } from "./antlr/CPP14Visitor";
import { AbstractParseTreeVisitor } from "antlr4ts/tree";
import { CPP14Lexer } from "./antlr/CPP14Lexer";
import { CPP14Parser, FunctiondefinitionContext, DeclaratorContext, DeclaratoridContext, NoptrdeclaratorContext, PtrdeclaratorContext, IdexpressionContext } from "./antlr/CPP14Parser";
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import * as fs from 'fs';
import * as path from 'path'

class CPPItem {
    name: string
    id: string
};


class CPPField extends CPPItem {

};

class CPPMethod extends CPPItem {

};


class CPPClass extends CPPItem {
    fields: Map<string, CPPField>
    methods: Map<string, CPPMethod>

};

interface ICPPScope {
    getById(id: string): CPPItem | undefined;
    getByName(id: string): Set<CPPItem>;
}

class CPPNameSpace extends CPPItem implements ICPPScope {

    itemsById: Map<string, CPPItem>;
    itemsByName: Map<string, Set<CPPItem>>;
    childScope: Map<string, ICPPScope>;

    getById(id: string): CPPItem | undefined {
        return this.itemsById.get(id);
    }
    getByName(id: string): Set<CPPItem> {
        let ret = this.itemsByName.get(id);
        if (!ret) {
            ret = new Set();
        }
        return ret;
    }
}


class CPPParameter {
    variableName: string;
    type: string;
}

class CPPType {

}

class CPPFunction extends CPPItem {
    returnType: CPPType;
    parameters: Array<CPPParameter>
}

class CPPProject {
    items: Map<string, CPPItem>
}

const rootNS = new CPPNameSpace();

class Parser extends AbstractParseTreeVisitor<void> implements CPP14Visitor<void>{
    protected defaultResult() {
    }
}

class ParametersParser extends Parser {

}

class IDParser extends Parser {
    parse()
}


class FunctionParser extends Parser {
    result: CPPFunction = new CPPFunction();
    parser(ctx: FunctiondefinitionContext) {
        const decl = ctx.declarator();
        this.parserDeclarator(decl);

        ctx.functionbody();
    }

    parserDeclarator(ctx: DeclaratorContext) {
        let decl = ctx.noptrdeclarator() || ctx.ptrdeclarator();
        if (decl instanceof PtrdeclaratorContext) {
            decl = decl.noptrdeclarator();
        }

        if (decl instanceof NoptrdeclaratorContext) {
            decl = decl.noptrdeclarator();
        }

        if (decl instanceof NoptrdeclaratorContext) {
            const declid = decl.declaratorid();
            if (declid) {


            }
        }
    }

}



class MyParser extends Parser {
    visitClassspecifier(ctx) {
        console.log(ctx);
    }

    visitFunctiondefinition(ctx) {
        const fv = new FunctionParser();
        fv.parser(ctx);
    }

}

let code = fs.readFileSync(path.resolve(__dirname, '../test/a.cpp')).toString();

let inputStream = new ANTLRInputStream(code);
let lexer = new CPP14Lexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new CPP14Parser(tokenStream);
let unit = parser.translationunit();

const visitor = new MyParser();
visitor.visit(unit);
