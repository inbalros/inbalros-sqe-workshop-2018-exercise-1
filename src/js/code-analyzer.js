import * as esprima from 'esprima';

var elementsDic =[];

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true},function (node) {
        var specificHandler = functionDic[node.type];
        if(specificHandler)
        {
            specificHandler(node);
        }
    });
};

const getModel = () => {
    return elementsDic;
};


const functionDic ={
    'Identifier':handleIdentifier,
    'VariableDeclarator':handleVariableDeclarator,
    'Literal':handleLiteral,
    'AssignmentExpression':handleAssignmentExpression,
    'ExpressionStatement':handleExpressionStatement,
    'BinaryExpression':handleBinaryExpression,
    'MemberExpression':handleMemberExpression,
    'ReturnStatement':handleReturnStatement,
    'IfStatement':handleIfStatement,
    'BlockStatement':handleBlockStatement,
    'WhileStatement':handleWhileStatement,
    'UnaryExpression':handleUnaryExpression,
    'FunctionDeclaration':handleFunctionDeclaration,
    'ElseIfStatement':handleElseIfStatement,
    'ForStatment':handleForStatment,
    'UpdateExpression':handleUpdateExpression
};

function insertToElementsDic(line,type,name,condition,value){
    elementsDic.push({
        line:   line,
        type: type,
        name:   name,
        condition: condition,
        value:   value
    });
}

function handleIdentifier(node)
{
    return node.name;
}

function handleVariableDeclarator(node)
{
    var line = node.loc.start.line;
    var type = node.type;
    var name = node.id.name;
    var condition = '';
    var value = '';
    insertToElementsDic(line,type,name,condition,value);
}

function handleLiteral(node)
{
    return node.raw;
}

function handleAssignmentExpression(node)
{
    var line = node.loc.start.line;
    var type = node.type;
    var name = functionDic[node.left.type](node.left);
    var condition = '';
    var value = functionDic[node.right.type](node.right);
    insertToElementsDic(line,type,name,condition,value);
}
function handleExpressionStatement(node)
{
    //console.log(node);
}

function handleBinaryExpression(node)
{
    var leftFunction =functionDic[node.left.type];
    var rightFunction = functionDic[node.right.type];
    if(leftFunction && rightFunction)
    {
        var left = leftFunction(node.left);
        var right = rightFunction(node.right);
        return (left+' '+node.operator + ' '+ right);
    }
}

function handleMemberExpression(node)
{
    return (functionDic[node.object.type](node.object)+'['+functionDic[node.property.type](node.property)+']')
}

function handleReturnStatement(node)
{
    var line = node.loc.start.line;
    var type = node.type;
    var name = '';
    var condition ='';
    var value = functionDic[node.argument.type](node.argument) ;
    insertToElementsDic(line,type,name,condition,value);
}

function handleIfStatement(node)
{
    var line = node.loc.start.line;
    var type = node.type;
    var name = '';
    var condition = functionDic[node.test.type](node.test);
    var value = '';
    insertToElementsDic(line,type,name,condition,value);
}

function handleBlockStatement(node)
{
    //console.log(node);
}

function handleWhileStatement(node)
{
    var line = node.loc.start.line;
    var type = node.type;
    var name = '';
    var condition = functionDic[node.test.type](node.test);
    var value = '';
    insertToElementsDic(line,type,name,condition,value);
}

function handleUnaryExpression(node)
{
    if(node.prefix)
    {
        return node.operator + functionDic[node.argument.type](node.argument)
    }
    else {
        return functionDic[node.argument.type](node.argument)
    }

}

function handleForStatment(node)
{
    //console.log(node);
}

function handleElseIfStatement(node)
{
    //console.log(node);
}

function handleUpdateExpression(node)
{
    //console.log(node);
}
function handleFunctionDeclaration(node) {
    var line = node.loc.start.line;
    var type = node.type;
    var name = node.id.name;
    var condition = '';
    var value = '';
    insertToElementsDic(line, type, name, condition, value);
    var index;
    for (index = 0; index < node.params.length; ++index) {
        var line = node.loc.start.line;
        var type = 'variable declaration';
        var name = node.params[index].name;
        var condition = '';
        var value = '';
        insertToElementsDic(line, type, name, condition, value);
    }
}


export {parseCode,getModel};
