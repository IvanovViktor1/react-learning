import React, { Component } from "react";
import styles from "./newComponent.module.scss";
import { text } from "stream/consumers";

// export interface BaseSuperButtonProps {
//   // type?: ButtonType;
//   icon?: React.ReactNode;
//   // shape?: ButtonShape;
//   // size?: SizeType;
//   disabled?: boolean;
//   loading?:
//     | boolean
//     | {
//         delay?: number;
//       };
//   prefixCls?: string;
//   className?: string;
//   rootClassName?: string;
//   ghost?: boolean;
//   danger?: boolean;
//   block?: boolean;
//   children?: React.ReactNode;
//   [key: `data-${string}`]: string;
//   classNames?: {
//     icon: string;
//   };
//   styles?: {
//     icon: React.CSSProperties;
//   };
// }

type SuperButtonState = {
  text?: string;
};

type SuperButtonProps = {
  text: string;
};

export default class SuperButton extends Component<
  SuperButtonProps,
  SuperButtonState
> {
  constructor(props: SuperButtonProps) {
    super(props);
    this.state = {
      text: "",
    };
  }

  // получить производное состояние из реквизита
  // должен вернуть объект для обновления состояния либо null, что бы ничего не обновлять
  static getDerivedStateFromProps(
    props: SuperButtonProps,
    state: SuperButtonState
  ) {}

  // компонент смонтировался
  // ничего не принимает и не возвращает
  //служит для дополнительных вычислений перед итоговым рендером
  componentDidMount(): void {}

  // следует ли обновить компонент
  // определяет должен компонент обновиться или нет
  shouldComponentUpdate(
    nextProps: Readonly<SuperButtonProps>,
    nextState: Readonly<SuperButtonState>,
    nextContext: any
  ): boolean {
    return true;
  }

  static defaultProps: SuperButtonProps = {
    text: "default text",
  };

  render() {
    return <div>{this.props.text}</div>;
  }
}

// SuperButton.defaultProps = {text: "asd"}
