'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var inquirer = require("inquirer");
var chalk = require('chalk');


var workingDir = function () {
  var dir = path.basename(process.cwd()).toLowerCase();
  switch (dir) {
    case 'components':
      return '.'
    case 'layouts':
      return '../components'
    case 'partials':
      return './components'
    case 'sass':
    case 'scss':
      return './partials/components'
    default:
      if (fs.existsSync('sass')) {
        return './sass/partials/components'
      }
      else if (fs.existsSync('scss')) {
        return './scss/partials/components'
      }
      else {
        console.log('You need to call the Component Generator from within your Sass directory');
        return false;
      }
      break;
  }
}

var ComponentGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    // console.log('Init');
  },

  askFor: function () {
    var done = this.async();
    var aspects = [];
    var _this = this;
    var line = new inquirer.Separator().line;

    var name = [
      {
        type: 'string',
        name: 'name',
        message: 'Component Name',
        default: this.name,
        validate: function (answer) {
          if (answer === '') {
            return "Component name cannot be empty";
          }
          else {
            return true;
          }
        }
      }
    ];

    var aspectPrompts = [
      {
        type: 'confirm',
        name: 'add',
        message: 'Add an aspect?',
        default: false
      },
      {
        type: 'string',
        name: 'aspect',
        message: 'Aspect name',
        when: function (answers) {
          return answers.add;
        },
        validate: function (answer) {
          var done = this.async();

          setTimeout(function () {
            if (answer === '') {
              done("Aspect name cannot be empty");
            }
            else if (aspects.indexOf(answer.toUpperCase()) > -1) {
              done("Aspect `" + answer + "` already exists!");
            }
            else {
              done(true);
            }
          }, 1000);

        }
      }
    ];

    var addAspect = function () {
      _this.prompt(aspectPrompts, function(props) {
        if (props.add) {
          aspects.push(props.aspect);
          console.log(line);
          addAspect();
        }
        else {
          this.aspects = aspects;
          done();
        }
      }.bind(_this));
    }

    this.prompt(name, function (props) {
      this.name = props.name;
      console.log(line);
      addAspect();
    }.bind(this));
  },

  files: function () {

    console.log(this.name);
    console.log(this.aspects);

    // this.copy('somefile.js', 'somefile.js');
  }
});

module.exports = ComponentGenerator;