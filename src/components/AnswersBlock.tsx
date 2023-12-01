import React from "react";

export type AnswersBlockProps = {
  id: string;
  title: string;
  isCorrect: string;
};

const AnswersBlock: React.FC<AnswersBlockProps> = ({
  id,
  title,
  isCorrect,
}) => {
  return (
    <div>
      <li>- {title}</li>
    </div>
  );
};

export default AnswersBlock;
