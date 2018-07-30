package com.zw.rule.jeval.operator;

/**
 * Created by Administrator on 2017/5/5 0005.
 */
public class ModulusOperator extends AbstractOperator{
    public ModulusOperator() {
        super("%", 6);
    }

    public double evaluate(double leftOperand, double rightOperand) {
        Double rtnValue = new Double(leftOperand % rightOperand);
        return rtnValue.doubleValue();
    }
}
