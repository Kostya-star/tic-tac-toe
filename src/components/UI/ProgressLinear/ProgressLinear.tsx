import cls from './ProgressLinear.module.scss'

export const ProgressLinear = () => {
  return (
    <div className={cls.progress}>
      <div className={cls.progress_container}>
        <div className={cls.progress_bar}></div>
      </div>
    </div>
  );
};
