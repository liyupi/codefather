# JavaFX图形化界面

JavaFX 是官方推荐的 Java 图形化界面框架，提供了更加现代化的 UI 控件、布局、CSS、控制等特性，甚至还支持 3D 渲染。通过 JavaFX，开发人员可以创建极具个性化和专业级别的用户界面。以下是对 JavaFX 的一些介绍。

## JavaFX 历史和特点
JavaFX 是一种用于创建跨平台的富客户端应用程序的框架。JavaFX 于 2008 年发布，作为前版的 Swing 的替代品。与 Swing 相比，JavaFX 更现代化，提供了更好的 UI 控件库和更加灵活的布局方式。JavaFX 还支持优秀的跨平台性，它的应用程序能够在 Windows、macOS 和 Linux 上运行，并且可以在 Web 上使用浏览器插件（2.0 版本及更低版本）或 Java Web Start 应用程序启动器（3.0 版本及更高版本）中运行。JavaFX 8 的最新版本是 8u202 和 11.0.2 （脱离 Java SE）。JavaFX 11 以后已经脱离 Java SE 体系，成为了 JavaFX SDK，开放了自己的开发路线。

JavaFX 的主要特点有：
- JavaFX 使用现代化标准，如 CSS、HTML 和 FXML 语言，使得 UI 开发工作更加“套路化”。
- JavaFX 拥有更先进的 UI 控件库，包括：按钮、菜单、文本框、标签、列表、表格、滚动面板、滑动条、颜色选择器、日期选择器等等。JavaFX 还可以通过 FXML 文件创建自定义 UI 控件，为您的应用带来独特的风格。
- JavaFX 是一个跨平台 UI 库，可以在 Windows、macOS 和 Linux 上运行，并且可以与浏览器插件或应用程序启动器一起在 Web 上运行。
- JavaFX 可以很好地与 Java 库和工具集成，包括 JavaFX Scene Builder、Maven 和其他 Java 开发工具。
- JavaFX 自带渲染引擎，用于向屏幕渲染 JavaFX 应用程序中的用户界面。JavaFX 还支持基于硬件加速的 2D 和 3D 渲染。

## JavaFX 应用场景
JavaFX 的特点决定了它在开发某些交互式应用程序时是一个很好的选择，比如：
- 图形化编辑器，如 Adobe Photoshop；
- 视频编辑器，如 Final Cut Pro；
- 数据可视化，如折线图、柱状图、扇形图等图表；
- Web 桌面应用程序，如邮件客户端、记事本、音乐播放器等；
- 游戏界面，如俄罗斯方块、跳一跳。

## JavaFX 基础
对于初学者来说，了解 JavaFX 的基础知识是非常重要的。JavaFX 的基础知识包括以下几个方面：
- 控制器和事件处理器：控制器是应用程序的逻辑部分。事件处理器则是控制器中处理用户输入的重要组成部分。用户在 UI 控件上进行操作时会触发特定的事件，事件处理器可以监听这些事件并做出相应的响应。
- 布局：JavaFX 的布局系统是 GUI 界面的重要部分。JavaFX 支持其自身的布局，该布局使其更容易创建具有专业外观和互动的 UI 控件。
- 样式化和可视调整：JavaFX 还支持 CSS 样式，允许您为控件制定自定义样式。这使得开发人员可以创建特定样式的 UI 控件，以确保应用程序具有一致的外观。
- 动画：JavaFX 支持基于关键帧的动画和基于时间轴的动画。这允许您轻松创建非常逼真和吸引人的 UI 工具。

## JavaFX 实战
JavaFX 的使用可以细分为 3 个步骤：创建 UI 快照（FXML 文件）、为 UI 添加控制器和添加事件处理程序。为了更好地解释，这里使用一个简单的例子（编写两个数字相加的 calculator）。

首先，需要创建 FXML 文件，如下所示：

```
<?xml version="1.0" encoding="UTF-8"?>
 
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
 
<GridPane xmlns:fx="http://javafx.com/fxml" alignment="center" hgap="10" vgap="10">
  <Label text="第一个数字:" GridPane.columnIndex="0" GridPane.rowIndex="0" />
  <TextField fx:id="firstNumberTextField" GridPane.columnIndex="1" GridPane.rowIndex="0" />
 
  <Label text="第二个数字:" GridPane.columnIndex="0" GridPane.rowIndex="1" />
  <TextField fx:id="secondNumberTextField" GridPane.columnIndex="1" GridPane.rowIndex="1" />
 
  <Label text="Result: " GridPane.columnIndex="0" GridPane.rowIndex="2" />
  <Label fx:id="resultLabel" GridPane.columnIndex="1" GridPane.rowIndex="2" />
 
  <Button text="Add Numbers" GridPane.columnIndex="1" GridPane.rowIndex="3" fx:id="addButton" />
</GridPane>
```

然后，需要为 UI 添加控制器。控制器是处理应用程序逻辑的代码。简单来说，我们需要将它绑定到 FXML 文件中定义的 UI 元素上。如下所示：

```java
public class CalculatorController {
 
  @FXML
  private Button addButton;
 
  @FXML
  private Label resultLabel;
 
  @FXML
  private void addNumbers(ActionEvent event) {
    Double sum = Double.parseDouble(firstNumberTextField.getText()) + 
        Double.parseDouble(secondNumberTextField.getText());
    resultLabel.setText(sum.toString());
  }
}
```

最后，为计算器添加事件处理程序。事件处理程序将 UI 控件与控制器中的方法进行关联。具体的方法是在 FXML 文件中使用 fx:controller 属性将控制器与 FXML 文件关联起来，然后在 XML 对应控件上使用 fx:id 属性关联控制器中的方法名称。如下所示：

```
<Button text="Add Numbers" GridPane.columnIndex="1" GridPane.rowIndex="3" fx:id="addButton" onAction="#addNumbers"/>
```

这就是 JavaFX 的一些基础知识和一个简单的示例应用程序。JavaFX 具有丰富的 UI 控件库，开发人员可以使用这些控件创建自己的专业应用程序。简单学习一下基础知识，即可为您的应用程序带来更好的性能和更高的用户体验。