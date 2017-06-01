package com.pscnlab.project.services;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.pscnlab.project.services.dtos.ProjectQueryPageDTO;

/**
 * Created by zengyh on 2017/5/15.
 */
public interface ProjectService {
    ResultsTotalDTO<ProjectQueryPageDTO> findPageProject(String state, Integer offset, Integer size);
}
