package com.rldk2002.bookstore.security.support;

import com.rldk2002.bookstore.security.userdetails.AccountStatus;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@MappedJdbcTypes(JdbcType.VARCHAR)
public class AccountStatusesTypeHandler extends BaseTypeHandler<Set<AccountStatus>> {

    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, Set<AccountStatus> accountStatuses, JdbcType jdbcType) throws SQLException {
        String param = accountStatuses.stream().map(AccountStatus::name)
                .collect(Collectors.joining(","));
        preparedStatement.setString(i, param);
    }

    @Override
    public Set<AccountStatus> getNullableResult(ResultSet resultSet, String s) throws SQLException {
        String statuses = resultSet.getString(s);
        if (statuses == null) {
            return Set.of();
        }
        return Arrays.stream(statuses.split(","))
                .map(AccountStatus::valueOf)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<AccountStatus> getNullableResult(ResultSet resultSet, int i) throws SQLException {
        String statuses = resultSet.getString(i);
        if (statuses == null) {
            return Set.of();
        }

        return Arrays.stream(statuses.split(","))
                .map(AccountStatus::valueOf)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<AccountStatus> getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        String statuses = callableStatement.getString(i);
        if (statuses == null) {
            return Set.of();
        }
        return Arrays.stream(statuses.split(","))
                .map(AccountStatus::valueOf)
                .collect(Collectors.toSet());
    }

}
