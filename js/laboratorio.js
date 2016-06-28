//Variáveis globais
var processingInstance;
var codemirror;

$(document).on('click', '#compileButton', function(evt) {
    //limpa e esconde mensagem de erro
    $('#messagecontainer').html('').hide();

    //interrompe processing anterior
    try {
        processingInstance.exit();
    } catch(err) {}

    //limpa o canvas
    try {
        var canvas = $('#drawingcanvas')[0];
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    } catch(err) {}

    var processingCode = codemirror.getValue();
    var codeId =  $('#codeinput').attr('codeid');
    //salva código no localStorage
    if (typeof(Storage) !== "undefined") {
        try {
            var existentCode = window.localStorage.setItem(codeId, processingCode);
            if(existentCode) {
                $('#codeinput').val(existentCode);
            }
        } catch (err) {}
    } 

    var compilation;
    try {
        compilation = Processing.compile(processingCode);
    } catch (err) {
        $('#messagecontainer').show().html('Erro de sintaxe do programa');
        return;
    }
    try {
        processingInstance = new Processing($('#drawingcanvas')[0], compilation);
    } catch(err) {
        $('#messagecontainer').show().html('Erro no programa: ' + err.description);
        return;
    }
});

$(function() {
    var codeId =  $('#codeinput').attr('codeid');
    //carrega código previamente gravado
    if (typeof(Storage) !== "undefined") {
        try {
            var existentCode = window.localStorage.getItem(codeId);
            if(existentCode) {
                $('#codeinput').val(existentCode);
            }
        } catch (err) {}
    } 

    //inicia editor CodeMirror
    codemirror = CodeMirror.fromTextArea($('#codeinput')[0], {
        lineNumbers: true,
        dragDrop: false,
        autofocus: true
    });

    //carrega exemplos
    $('.example').each(function() {
        var code = $(this).find('code').html(); 
        Prism.highlightElement($(this).find('code')[0], false);
        new Processing($(this).find('canvas')[0], code);
    });

    //carrega prism em outros campos (ex: referência)
    $('.autoprism').each(function() {
        Prism.highlightElement(this);
    });

    
});