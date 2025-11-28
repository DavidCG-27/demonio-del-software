// js/data.js

export const STANDARD_PATTERNS = [
    {
        name: "Strategy",
        def: `classDiagram
    class Context {
        +contextInterface()
    }
    class Strategy {
        <<interface>>
        +algorithmInterface()
    }
    class ConcreteStrategyA {
        +algorithmInterface()
    }
    class ConcreteStrategyB {
        +algorithmInterface()
    }
    class ConcreteStrategyC {
        +algorithmInterface()
    }
    Context --> Strategy
    Strategy <|.. ConcreteStrategyA
    Strategy <|.. ConcreteStrategyB
    Strategy <|.. ConcreteStrategyC`
    },
    {
        name: "Factory Method",
        def: `classDiagram
    class Creator {
        +anOperation()
        #factoryMethod()
    }
    class ConcreteCreator {
        #factoryMethod()
    }
    class Product {
        <<interface>>
    }
    class ConcreteProduct

    Creator <|-- ConcreteCreator
    Product <|.. ConcreteProduct
    ConcreteCreator ..> ConcreteProduct : create
    note for Creator "product = factoryMethod()"
    note for ConcreteCreator "return new ConcreteProduct()"`
    },
    {
        name: "Abstract Factory",
        def: `classDiagram
    class Client
    class AbstractFactory {
        <<interface>>
        +CreateProductA()
        +CreateProductB()
    }
    class ConcreteFactory1 {
        +CreateProductA()
        +CreateProductB()
    }
    class ConcreteFactory2 {
        +CreateProductA()
        +CreateProductB()
    }
    class AbstractProductA {
        <<interface>>
    }
    class AbstractProductB {
        <<interface>>
    }
    class ProductA1
    class ProductA2
    class ProductB1
    class ProductB2

    Client --> AbstractFactory
    Client --> AbstractProductA
    Client --> AbstractProductB
    AbstractFactory <|.. ConcreteFactory1
    AbstractFactory <|.. ConcreteFactory2
    AbstractProductA <|.. ProductA1
    AbstractProductA <|.. ProductA2
    AbstractProductB <|.. ProductB1
    AbstractProductB <|.. ProductB2
    ConcreteFactory1 ..> ProductA1 : creates
    ConcreteFactory1 ..> ProductB1 : creates
    ConcreteFactory2 ..> ProductA2 : creates
    ConcreteFactory2 ..> ProductB2 : creates`
    },
    {
        name: "Composite",
        def: `classDiagram
    class Client
    class Component {
        <<interface>>
        +operation()
        +add(Component)
        +remove(Component)
        +getChild(int)
    }
    class Leaf {
        +operation()
    }
    class Composite {
        +operation()
        +add(Component)
        +remove(Component)
        +getChild(int)
    }
    Client ..> Component
    Component <|.. Leaf
    Component <|.. Composite
    Composite o--> Component : children
    note for Composite "forall g in children g.operation()"`
    },
    {
        name: "State",
        def: `classDiagram
    class Context {
        -state: State
        +request()
    }
    class State {
        <<interface>>
        +handle()
    }
    class ConcreteStateA {
        +handle()
    }
    class ConcreteStateB {
        +handle()
    }
    Context --> State
    State <|.. ConcreteStateA
    State <|.. ConcreteStateB
    note for Context "state.handle()"`
    },
    {
        name: "Decorator",
        def: `classDiagram
    class Component {
        <<interface>>
        +methodA()
        +methodB()
    }
    class ConcreteComponent {
        +methodA()
        +methodB()
    }
    class Decorator {
        +methodA()
        +methodB()
    }
    class ConcreteDecoratorA {
        -wrappedObj: Component
        +methodA()
        +methodB()
    }
    class ConcreteDecoratorB {
        -wrappedObj: Component
        +methodA()
        +methodB()
    }
    Component <|.. ConcreteComponent
    Component <|.. Decorator
    Decorator o--> Component
    Decorator <|-- ConcreteDecoratorA
    Decorator <|-- ConcreteDecoratorB
    note for ConcreteDecoratorA "wrappedObj.methodA(); // behavior"`
    },
    {
        name: "Observer",
        def: `classDiagram
    class Subject {
        -observers
        -subjectState
        +attach(Observer)
        +detach(Observer)
        +notify()
        +getState()
        +setState()
    }
    class Observer {
        <<interface>>
        +update()
    }
    class ConcreteObserver {
        -observerState
        +update()
    }
    Subject --> Observer
    Observer <|.. ConcreteObserver
    ConcreteObserver --> Subject
    note for Subject "for all o in observers { o.update() }"
    note for ConcreteObserver "observerState = subject.getState()"`
    },
    {
        name: "Prototype",
        def: `classDiagram
    class Client {
        -prototype: Prototype
        +operation()
    }
    class Prototype {
        <<interface>>
        +clone() : Prototype
    }
    class ConcretePrototype1 {
        +clone() : Prototype
    }
    class ConcretePrototype2 {
        +clone() : Prototype
    }
    Client --> Prototype
    Prototype <|.. ConcretePrototype1
    Prototype <|.. ConcretePrototype2
    note for Client "p = prototype.clone()"`
    },
    {
        name: "Visitor",
        def: `classDiagram
    class Client
    class ObjectStructure
    class Visitor {
        <<interface>>
        +visit(ConcreteElementA, Object)
        +visit(ConcreteElementB, Object)
    }
    class ConcreteVisitor1 {
        +visit(ConcreteElementA, Object)
        +visit(ConcreteElementB, Object)
    }
    class ConcreteVisitor2 {
        +visit(ConcreteElementA, Object)
        +visit(ConcreteElementB, Object)
    }
    class Element {
        <<interface>>
        +accept(Visitor, Object)
    }
    class ConcreteElementA {
        +accept(Visitor, Object)
        +operationA()
    }
    class ConcreteElementB {
        +accept(Visitor, Object)
        +operationB()
    }

    Client ..> Visitor
    Client ..> ObjectStructure
    ObjectStructure --> Element
    Visitor <|.. ConcreteVisitor1
    Visitor <|.. ConcreteVisitor2
    Element <|.. ConcreteElementA
    Element <|.. ConcreteElementB
    note for ConcreteElementA "v.visit(this)"`
    },
    {
        name: "Adapter",
        def: `classDiagram
    class Client
    class Target {
        <<interface>>
        +request()
    }
    class Adapter {
        -adaptee: Adaptee
        +request()
    }
    class Adaptee {
        +specificRequest()
    }
    Client ..> Target
    Target <|.. Adapter
    Adapter --> Adaptee : adaptee
    note for Adapter "adaptee.specificRequest()"`
    },
    {
        name: "Template Method",
        def: `classDiagram
    class AbstractClass {
        +templateMethod()
        #primitiveOperation1()
        #primitiveOperation2()
    }
    class ConcreteClass {
        #primitiveOperation1()
        #primitiveOperation2()
    }
    AbstractClass <|-- ConcreteClass
    note for AbstractClass "primitiveOperation1(); primitiveOperation2();"`
    },
    {
        name: "Command",
        def: `classDiagram
    class Client
    class Invoker {
        -command
    }
    class Command {
        <<interface>>
        +execute()
    }
    class ConcreteCommand {
        -state
        +execute()
    }
    class Receiver {
        +action()
    }
    Client --> Invoker
    Client --> Receiver
    Client ..> ConcreteCommand : create
    Invoker --> Command
    Command <|.. ConcreteCommand
    ConcreteCommand --> Receiver
    note for ConcreteCommand "receiver.action()"`
    }
];